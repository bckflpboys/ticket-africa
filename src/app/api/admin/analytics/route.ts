import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import Event from '@/models/Event';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();

    // Calculate date ranges
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Get current period data
    const [
      currentRevenue, 
      currentUsers, 
      currentEvents, 
      recentSales, 
      topEvents, 
      userSignups, 
      categoryPerformance,
      geographicData,
      ticketTypeAnalysis,
      eventTimingData
    ] = await Promise.all([
      // Total revenue for current period
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth },
            paymentStatus: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]),

      // Total users
      User.countDocuments({
        createdAt: { $gte: lastMonth }
      }),

      // Active events
      Event.countDocuments({
        status: 'published',
        date: { $gte: now }
      }),

      // Recent sales (last 7 days)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
            paymentStatus: 'completed'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            amount: { $sum: '$total' }
          }
        },
        {
          $sort: { _id: -1 }
        }
      ]),

      // Top performing events
      Event.aggregate([
        {
          $match: {
            status: 'published'
          }
        },
        {
          $lookup: {
            from: 'orders',
            let: { eventId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  paymentStatus: 'completed'
                }
              },
              {
                $unwind: '$tickets'
              },
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$tickets.eventId' }, '$$eventId']
                  }
                }
              }
            ],
            as: 'eventOrders'
          }
        },
        {
          $project: {
            name: '$title',
            tickets: {
              $sum: {
                $map: {
                  input: '$eventOrders',
                  as: 'order',
                  in: '$$order.tickets.quantity'
                }
              }
            },
            revenue: {
              $sum: {
                $map: {
                  input: '$eventOrders',
                  as: 'order',
                  in: { $multiply: ['$$order.tickets.quantity', '$$order.tickets.price'] }
                }
              }
            }
          }
        },
        {
          $match: {
            $or: [
              { tickets: { $gt: 0 } },
              { revenue: { $gt: 0 } }
            ]
          }
        },
        {
          $sort: { revenue: -1 }
        },
        {
          $limit: 5
        }
      ]),

      // Daily user signups (last 7 days)
      User.aggregate([
        {
          $match: {
            createdAt: { 
              $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),

      // Category performance
      Event.aggregate([
        {
          $match: {
            status: 'published',
            date: { $gte: lastMonth }
          }
        },
        {
          $lookup: {
            from: 'orders',
            let: { eventId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  paymentStatus: 'completed'
                }
              },
              {
                $unwind: '$tickets'
              },
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$tickets.eventId' }, '$$eventId']
                  }
                }
              }
            ],
            as: 'eventOrders'
          }
        },
        {
          $group: {
            _id: '$category',
            totalEvents: { $sum: 1 },
            totalTickets: {
              $sum: {
                $reduce: {
                  input: '$eventOrders',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this.tickets.quantity'] }
                }
              }
            },
            totalRevenue: {
              $sum: {
                $reduce: {
                  input: '$eventOrders',
                  initialValue: 0,
                  in: { 
                    $add: ['$$value', { $multiply: ['$$this.tickets.quantity', '$$this.tickets.price'] }]
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            category: '$_id',
            totalEvents: 1,
            totalTickets: 1,
            totalRevenue: 1,
            averageTicketPrice: {
              $cond: [
                { $eq: ['$totalTickets', 0] },
                0,
                { $divide: ['$totalRevenue', '$totalTickets'] }
              ]
            }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        }
      ]),

      // Geographic Analysis
      Event.aggregate([
        {
          $match: {
            status: 'published',
            date: { $gte: lastMonth }
          }
        },
        {
          $lookup: {
            from: 'orders',
            let: { eventId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  paymentStatus: 'completed'
                }
              },
              {
                $unwind: '$tickets'
              },
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$tickets.eventId' }, '$$eventId']
                  }
                }
              }
            ],
            as: 'eventOrders'
          }
        },
        {
          $addFields: {
            locationData: {
              $cond: {
                if: { $eq: [{ $type: '$location' }, 'string'] },
                then: { $toObjectId: '$location' },
                else: '$location'
              }
            },
            totalTickets: {
              $sum: {
                $map: {
                  input: '$eventOrders',
                  as: 'order',
                  in: '$$order.tickets.quantity'
                }
              }
            },
            totalRevenue: {
              $sum: {
                $map: {
                  input: '$eventOrders',
                  as: 'order',
                  in: { $multiply: ['$$order.tickets.quantity', '$$order.tickets.price'] }
                }
              }
            }
          }
        },
        {
          $group: {
            _id: {
              city: '$locationData.venue.city',
              state: '$locationData.venue.state',
              country: '$locationData.venue.country'
            },
            events: { $sum: 1 },
            totalTickets: { $sum: '$totalTickets' },
            totalRevenue: { $sum: '$totalRevenue' },
            locations: {
              $push: {
                name: '$locationData.venue.name',
                address: '$locationData.venue.address',
                coordinates: '$locationData.venue.coordinates'
              }
            }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        }
      ]),

      // Ticket Type Analysis
      Event.aggregate([
        {
          $match: {
            status: 'published',
            date: { $gte: lastMonth }
          }
        },
        {
          $unwind: '$ticketTypes'
        },
        {
          $lookup: {
            from: 'orders',
            let: { 
              eventId: { $toString: '$_id' },
              ticketType: '$ticketTypes.name'
            },
            pipeline: [
              {
                $match: {
                  paymentStatus: 'completed'
                }
              },
              {
                $unwind: '$tickets'
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toString: '$tickets.eventId' }, '$$eventId'] },
                      { $eq: ['$tickets.ticketType', '$$ticketType'] }
                    ]
                  }
                }
              }
            ],
            as: 'ticketOrders'
          }
        },
        {
          $group: {
            _id: {
              name: '$ticketTypes.name',
              priceRange: {
                $switch: {
                  branches: [
                    { case: { $lte: ['$ticketTypes.price', 1000] }, then: '0-1000' },
                    { case: { $lte: ['$ticketTypes.price', 5000] }, then: '1001-5000' },
                    { case: { $lte: ['$ticketTypes.price', 10000] }, then: '5001-10000' },
                    { case: { $lte: ['$ticketTypes.price', 20000] }, then: '10001-20000' }
                  ],
                  default: '20000+'
                }
              }
            },
            totalSold: {
              $sum: {
                $reduce: {
                  input: '$ticketOrders',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this.tickets.quantity'] }
                }
              }
            },
            revenue: {
              $sum: {
                $reduce: {
                  input: '$ticketOrders',
                  initialValue: 0,
                  in: { 
                    $add: ['$$value', { $multiply: ['$$this.tickets.quantity', '$$this.tickets.price'] }]
                  }
                }
              }
            },
            averagePrice: { $avg: '$ticketTypes.price' }
          }
        }
      ]),

      // Event Timing Analysis
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'completed',
            createdAt: { $gte: lastMonth }
          }
        },
        {
          $lookup: {
            from: 'events',
            let: { eventId: '$eventId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$eventId'] }
                }
              }
            ],
            as: 'event'
          }
        },
        {
          $unwind: '$event'
        },
        {
          $group: {
            _id: {
              hour: { $hour: '$createdAt' },
              dayOfWeek: { $dayOfWeek: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            bookings: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        {
          $sort: { '_id.month': 1, '_id.dayOfWeek': 1, '_id.hour': 1 }
        }
      ])
    ]);

    // Get previous period data
    const [previousRevenue, previousUsers, previousEvents] = await Promise.all([
      // Previous revenue
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: twoMonthsAgo,
              $lt: lastMonth
            },
            paymentStatus: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]),

      // Previous users
      User.countDocuments({
        createdAt: {
          $gte: twoMonthsAgo,
          $lt: lastMonth
        }
      }),

      // Previous events
      Event.countDocuments({
        status: 'published',
        date: {
          $gte: twoMonthsAgo,
          $lt: lastMonth
        }
      })
    ]);

    // Calculate ticket counts from orders
    const [currentTickets, previousTickets] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth },
            paymentStatus: 'completed'
          }
        },
        {
          $unwind: '$tickets'
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$tickets.quantity' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: twoMonthsAgo,
              $lt: lastMonth
            },
            paymentStatus: 'completed'
          }
        },
        {
          $unwind: '$tickets'
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$tickets.quantity' }
          }
        }
      ])
    ]);

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const currentRevenueTotal = currentRevenue[0]?.total || 0;
    const previousRevenueTotal = previousRevenue[0]?.total || 0;
    const currentTicketsTotal = currentTickets[0]?.total || 0;
    const previousTicketsTotal = previousTickets[0]?.total || 0;

    // Log the topEvents data before sending
    console.log('Top Events from aggregation:', topEvents);

    const response = {
      revenue: {
        total: currentRevenueTotal,
        change: calculateChange(currentRevenueTotal, previousRevenueTotal)
      },
      users: {
        total: currentUsers,
        change: calculateChange(currentUsers, previousUsers)
      },
      tickets: {
        total: currentTicketsTotal,
        change: calculateChange(currentTicketsTotal, previousTicketsTotal)
      },
      events: {
        total: currentEvents,
        change: calculateChange(currentEvents, previousEvents)
      },
      recentSales: recentSales.map(sale => ({
        date: sale._id,
        amount: sale.amount
      })),
      topEvents: topEvents.map(event => ({
        name: event.name,
        tickets: event.tickets || 0,
        revenue: event.revenue || 0
      })),
      userSignups: userSignups.map(signup => ({
        date: signup._id,
        count: signup.count
      })),
      categoryPerformance: categoryPerformance.map(category => ({
        category: category.category,
        totalEvents: category.totalEvents,
        totalTickets: category.totalTickets,
        totalRevenue: category.totalRevenue,
        averageTicketPrice: category.averageTicketPrice
      })),
      geographicData: geographicData.map(location => ({
        city: location._id.city,
        state: location._id.state,
        country: location._id.country,
        events: location.events,
        totalTickets: location.totalTickets,
        totalRevenue: location.totalRevenue,
        locations: location.locations
      })),
      ticketTypeAnalysis: ticketTypeAnalysis.map(analysis => ({
        name: analysis._id.name,
        priceRange: analysis._id.priceRange,
        totalSold: analysis.totalSold,
        revenue: analysis.revenue,
        averagePrice: analysis.averagePrice
      })),
      eventTimingData: eventTimingData.map(timing => ({
        hour: timing._id.hour,
        dayOfWeek: timing._id.dayOfWeek,
        month: timing._id.month,
        bookings: timing.bookings,
        revenue: timing.revenue
      }))
    };

    console.log('Final response topEvents:', response.topEvents);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in analytics route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
