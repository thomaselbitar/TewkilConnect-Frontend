


// Individual requests created by the user (not in groups)
export const userIndividualRequests = [
  {
    id: 'user_req_1',
    category: 'Electrical',
    title: 'Website Development for Small Business',
    description: 'Need a professional website for my restaurant. Should include menu, contact info, and online ordering system.',
    timing: {
      type: 'flexible',
      day: 'Monday',
      timeSlot: 'Morning'
    },
    location: {
      city: 'Beirut',
      street: 'Hamra Street',
      building: 'Building 123',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 1500,
      hourlyRate: 0
    },
    providerSelection: {
      type: 'all',
      selectedProvider: null
    },
    status: 'Pending',
    createdAt: '2024-01-15',
    userId: 'user_123',
    offers: [
      {
        id: 'offer_1',
        provider: {
          id: '1',
          name: 'Ahmed Hassan',
          category: 'Electrical',
          rating: 4.8,
          profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
          location: 'Beirut',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 1400,
          hourlyRate: 0
        },
        timing: {
          date: '2024-02-15',
          time: '2024-02-15T10:00:00'
        },
        message: 'I have extensive experience in restaurant website development. I can create a modern, responsive website with online ordering system. I can start next week and complete within 2 weeks.',
        status: 'active',
        createdAt: '2024-01-20'
      },
      {
        id: 'offer_2',
        provider: {
          id: '2',
          name: 'Michael Chen',
          category: 'Electrical',
          rating: 4.5,
          profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
          location: 'Beirut',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'hourly',
          amount: 0,
          hourlyRate: 35
        },
        timing: {
          date: '2024-01-18',
          time: '2024-01-18T10:00:00'
        },
        message: 'I specialize in e-commerce websites and can build a professional restaurant website with online ordering. I estimate 40-50 hours of work.',
        status: 'accepted',
        createdAt: '2024-01-17'
      }
    ]
  },
  {
    id: 'user_req_2',
    category: 'Electrical',
    title: 'Install Smart Home System',
    description: 'Need to install smart lighting and security system in my apartment. Includes smart switches and motion sensors.',
    timing: {
      type: 'urgent',
      day: '',
      timeSlot: ''
    },
    location: {
      city: 'Tripoli',
      street: 'Al Mina Road',
      building: 'Apartment 5B',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'hourly',
      amount: 0,
      hourlyRate: 25
    },
    providerSelection: {
      type: 'specific',
      selectedProvider: {
        id: '7',
        name: 'Hani Wehbe',
        category: 'Electrical',
        rating: 2.7,
        profilePicture: 'https://randomuser.me/api/portraits/men/17.jpg',
        location: 'Beirut',
        available: true
      }
    },
    status: 'In Progress',
    createdAt: '2024-01-10',
    userId: 'user_123',
    offers: [
      {
        id: 'offer_3',
        provider: {
          id: '7',
          name: 'Hani Wehbe',
          category: 'Electrical',
          rating: 2.7,
          profilePicture: 'https://randomuser.me/api/portraits/men/17.jpg',
          location: 'Beirut',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'hourly',
          amount: 0,
          hourlyRate: 28
        },
        timing: {
          date: '2024-01-25',
          time: '2024-01-25T09:00:00'
        },
        message: 'I can start the electrical work next week. I have experience with kitchen electrical installations and can complete the work efficiently.',
        status: 'accepted',
        createdAt: '2024-01-23'
      }
    ]
  },
  {
    id: 'user_req_3',
    category: 'Massage',
    title: 'Weight Loss Training Program',
    description: 'Looking for a personal trainer to help me lose 20kg. Need a 3-month program with nutrition guidance.',
    timing: {
      type: 'flexible',
      day: 'Wednesday',
      timeSlot: 'Evening'
    },
    location: {
      city: 'Sidon',
      street: 'Saida Beach Road',
      building: 'Fitness Center',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 800,
      hourlyRate: 0
    },
    providerSelection: {
      type: 'specific',
      selectedProvider: {
        id: '15',
        name: 'Nour Al-Zein',
        category: 'Massage',
        rating: 4.8,
        profilePicture: 'https://randomuser.me/api/portraits/women/25.jpg',
        location: 'Sidon',
        available: true
      }
    },
    status: 'Finished',
    createdAt: '2024-01-05',
    userId: 'user_123',
    offers: [
      {
        id: 'offer_4',
        provider: {
          id: '15',
          name: 'Nour Al-Zein',
          category: 'Massage',
          rating: 4.8,
          profilePicture: 'https://randomuser.me/api/portraits/women/25.jpg',
          location: 'Sidon',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 750,
          hourlyRate: 0
        },
        timing: {
          date: '2024-02-01',
          time: '2024-02-01T18:00:00'
        },
        message: 'I specialize in weight loss programs and have helped many clients achieve their goals. I can create a personalized 3-month program with nutrition guidance and regular check-ins.',
        status: 'declined',
        createdAt: '2024-01-25'
      }
    ]
  },
  {
    id: 'user_req_4',
    category: 'Plumbing',
    title: 'Bathroom Plumbing Repair',
    description: 'Need to fix leaking faucet and replace shower head. Also need to check for any other plumbing issues.',
    timing: {
      type: 'urgent',
      day: '',
      timeSlot: ''
    },
    location: {
      city: 'Jounieh',
      street: 'Coastal Road',
      building: 'Apartment 12C',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 200,
      hourlyRate: 0
    },
    providerSelection: {
      type: 'all',
      selectedProvider: null
    },
    status: 'Pending',
    createdAt: '2024-01-28',
    userId: 'user_123',
    offers: [
      {
        id: 'offer_5',
        provider: {
          id: '20',
          name: 'Ali Mansour',
          category: 'Plumbing',
          rating: 4.2,
          profilePicture: 'https://randomuser.me/api/portraits/men/20.jpg',
          location: 'Jounieh',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 180,
          hourlyRate: 0
        },
        timing: {
          date: '2024-01-30',
          time: '2024-01-30T14:00:00'
        },
        message: 'I can fix the leaking faucet and replace the shower head. I\'ll also do a full inspection of your bathroom plumbing to identify any other issues.',
        status: 'active',
        createdAt: '2024-01-29'
      },
      {
        id: 'offer_6',
        provider: {
          id: '21',
          name: 'Omar Khalil',
          category: 'Plumbing',
          rating: 3.8,
          profilePicture: 'https://randomuser.me/api/portraits/men/21.jpg',
          location: 'Jounieh',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'hourly',
          amount: 0,
          hourlyRate: 25
        },
        timing: {
          date: '2024-01-31',
          time: '2024-01-31T10:00:00'
        },
        message: 'I\'m available tomorrow morning. I can fix the faucet and shower head. I estimate it will take about 2-3 hours.',
        status: 'active',
        createdAt: '2024-01-29'
      }
    ]
  },
  {
    id: 'user_req_5',
    category: 'Beauty',
    title: 'Wedding Photography Package',
    description: 'Need professional wedding photography for my wedding ceremony and reception. Full day coverage required.',
    timing: {
      type: 'flexible',
      day: 'Saturday',
      timeSlot: 'All Day'
    },
    location: {
      city: 'Byblos',
      street: 'Byblos Castle',
      building: 'Wedding Venue',
      images: [
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 1200,
      hourlyRate: 0
    },
    providerSelection: {
      type: 'specific',
      selectedProvider: {
        id: '25',
        name: 'Sarah Johnson',
        category: 'Beauty',
        rating: 4.9,
        profilePicture: 'https://randomuser.me/api/portraits/women/35.jpg',
        location: 'Byblos',
        available: true
      }
    },
    status: 'Declined',
    createdAt: '2024-01-12',
    userId: 'user_123',
    offers: [
      {
        id: 'offer_7',
        provider: {
          id: '25',
          name: 'Sarah Johnson',
          category: 'Beauty',
          rating: 4.9,
          profilePicture: 'https://randomuser.me/api/portraits/women/35.jpg',
          location: 'Byblos',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 1500,
          hourlyRate: 0
        },
        timing: {
          date: '2024-02-15',
          time: '2024-02-15T08:00:00'
        },
        message: 'I would love to photograph your wedding! However, I need to increase my rate to $1500 for full day coverage. I can provide 500+ edited photos and a beautiful wedding album.',
        status: 'declined',
        createdAt: '2024-01-15'
      }
    ]
  },
  {
    id: 'user_req_6',
    category: 'Catering Services',
    title: 'Corporate Event Catering',
    description: 'Need catering services for a corporate event with 50 guests. Finger foods and beverages required.',
    timing: {
      type: 'urgent'
    },
    location: {
      city: 'Beirut',
      street: 'Hamra Street',
      building: 'Conference Center',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 800,
      hourlyRate: 0
    },
    providerSelection: {
      type: 'all',
      selectedProvider: null
    },
    status: 'Declined',
    createdAt: '2024-01-08',
    userId: 'user_123',
    offers: [
      {
        id: 'offer_8',
        provider: {
          id: '26',
          name: 'Marco Restaurant',
          category: 'Catering Services',
          rating: 4.3,
          profilePicture: 'https://randomuser.me/api/portraits/men/36.jpg',
          location: 'Beirut',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 1000,
          hourlyRate: 0
        },
        timing: {
          date: '2024-01-20',
          time: '2024-01-20T18:00:00'
        },
        message: 'We can provide excellent catering for your corporate event. Our minimum order is $1000 for 50 guests. We offer a variety of finger foods and premium beverages.',
        status: 'declined',
        createdAt: '2024-01-10'
      }
    ]
  },
  {
    id: 'user_req_7',
    category: 'Electrical',
    title: 'Home Electrical Repair',
    description: 'Need to fix electrical outlets in the living room and install new light fixtures.',
    timing: {
      type: 'flexible',
      day: 'Wednesday',
      timeSlot: 'Afternoon'
    },
    location: {
      city: 'Beirut',
      street: 'Verdun Street',
      building: 'Apartment 5B',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'hourly',
      amount: 0,
      hourlyRate: 25
    },
    providerSelection: {
      type: 'all',
      selectedProvider: null
    },
    status: 'Declined',
    createdAt: '2024-01-05',
    userId: 'user_123',
    offers: [
      {
        id: 'offer_9',
        provider: {
          id: '27',
          name: 'Hassan Electric',
          category: 'Electrical',
          rating: 4.1,
          profilePicture: 'https://randomuser.me/api/portraits/men/37.jpg',
          location: 'Beirut',
          available: true
        },
        budget: {
          hasBudget: true,
          type: 'hourly',
          amount: 0,
          hourlyRate: 35
        },
        timing: {
          date: '2024-01-12',
          time: '2024-01-12T14:00:00'
        },
        message: 'I can help with your electrical repairs. However, my rate is $35/hour for this type of work. I can start next week.',
        status: 'declined',
        createdAt: '2024-01-07'
      }
    ]
  }
];

// Group works created by the user
export const userGroupWorks = [
  {
    id: 'group_1',
    title: 'Home Renovation Project',
    description: 'Complete home renovation including kitchen, bathroom, and living room updates. Multiple contractors needed.',
    createdAt: '2024-01-20',
    userId: 'user_123',
    status: 'In Progress',
    requests: [
      {
        id: 'group_req_1_1',
        category: 'Plumbing',
        title: 'Kitchen Plumbing Installation',
        description: 'Install new kitchen sink, dishwasher, and garbage disposal. Update all plumbing fixtures.',
        timing: {
          type: 'flexible',
          day: 'Tuesday',
          timeSlot: 'Morning'
        },
        location: {
          city: 'Beirut',
          street: 'Achrafieh',
          building: 'Villa 15',
          images: []
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 1200,
          hourlyRate: 0
        },
        providerSelection: {
          type: 'specific',
          selectedProvider: {
            id: '12',
            name: 'Ahmad Mansour',
            category: 'Plumbing',
            rating: 4.2,
            profilePicture: 'https://randomuser.me/api/portraits/men/22.jpg',
            location: 'Beirut',
            available: true
          }
        },
        status: 'In Progress',
        groupId: 'group_1',
        createdAt: '2024-01-21'
      },
      {
        id: 'group_req_1_2',
        category: 'Electrical',
        title: 'Kitchen Electrical Work',
        description: 'Install new electrical outlets, lighting fixtures, and range hood. Update electrical panel.',
        timing: {
          type: 'flexible',
          day: 'Wednesday',
          timeSlot: 'Morning'
        },
        location: {
          city: 'Beirut',
          street: 'Achrafieh',
          building: 'Villa 15',
          images: []
        },
        budget: {
          hasBudget: true,
          type: 'hourly',
          amount: 0,
          hourlyRate: 30
        },
        providerSelection: {
          type: 'specific',
          selectedProvider: {
            id: '8',
            name: 'Layla Osman',
            category: 'Electrical',
            rating: 3.5,
            profilePicture: 'https://randomuser.me/api/portraits/women/18.jpg',
            location: 'Jounieh',
            available: true
          }
        },
        status: 'Pending',
        groupId: 'group_1',
        createdAt: '2024-01-22',
        offers: [
          {
            id: 'offer_6',
            provider: {
              id: '8',
              name: 'Layla Osman',
              category: 'Electrical',
              rating: 3.5,
              profilePicture: 'https://randomuser.me/api/portraits/women/18.jpg',
              location: 'Jounieh',
              available: true
            },
            budget: {
              hasBudget: true,
              type: 'hourly',
              amount: 0,
              hourlyRate: 28
            },
            timing: {
              date: '2024-01-25',
              time: '2024-01-25T09:00:00'
            },
            message: 'I can start the electrical work next week. I have experience with kitchen electrical installations and can complete the work efficiently.',
            createdAt: '2024-01-23'
          }
        ]
      }
    ]
  },
  {
    id: 'group_2',
    title: 'Wedding Preparation Services',
    description: 'Complete wedding preparation including venue decoration, catering, photography, and entertainment.',
    createdAt: '2024-01-18',
    userId: 'user_123',
    status: 'Pending',
    requests: [
      {
        id: 'group_req_2_1',
        category: 'Barber',
        title: 'Bridal Hair and Makeup',
        description: 'Complete bridal hair styling and makeup for wedding day. Includes trial session and day-of service.',
        timing: {
          type: 'flexible',
          day: 'Saturday',
          timeSlot: 'Morning'
        },
        location: {
          city: 'Byblos',
          street: 'Byblos Castle',
          building: 'Wedding Venue',
          images: [
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop'
          ]
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 500,
          hourlyRate: 0
        },
        providerSelection: {
          type: 'all',
          selectedProvider: null
        },
        status: 'Pending',
        groupId: 'group_2',
        createdAt: '2024-01-19',
        offers: [
          {
            id: 'offer_3',
            provider: {
              id: '3',
              name: 'Emma Wilson',
              category: 'Barber',
              rating: 4.9,
              profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
              location: 'Byblos',
              available: true
            },
            budget: {
              hasBudget: true,
              type: 'fixed',
              amount: 450,
              hourlyRate: 0
            },
            timing: {
              date: '2024-02-15',
              time: '2024-02-15T08:00:00'
            },
            message: 'I have 10+ years of experience in bridal hair styling. I can create the perfect look for your special day. I offer a free trial session before the wedding.',
            createdAt: '2024-01-20'
          }
        ]
      },
      {
        id: 'group_req_2_2',
        category: 'Beauty',
        title: 'Bridal Party Makeup',
        description: 'Makeup services for bridesmaids and family members. Natural and elegant looks.',
        timing: {
          type: 'flexible',
          day: 'Saturday',
          timeSlot: 'Morning'
        },
        location: {
          city: 'Byblos',
          street: 'Byblos Castle',
          building: 'Wedding Venue',
          images: [
            'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'
          ]
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 300,
          hourlyRate: 0
        },
        providerSelection: {
          type: 'all',
          selectedProvider: null
        },
        status: 'Pending',
        groupId: 'group_2',
        createdAt: '2024-01-20',
        offers: [
          {
            id: 'offer_4',
            provider: {
              id: '4',
              name: 'Lisa Rodriguez',
              category: 'Beauty',
              rating: 4.7,
              profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
              location: 'Byblos',
              available: true
            },
            budget: {
              hasBudget: true,
              type: 'fixed',
              amount: 280,
              hourlyRate: 0
            },
            timing: {
              date: '2024-02-15',
              time: '2024-02-15T09:00:00'
            },
            message: 'I specialize in natural and elegant bridal makeup. I can accommodate the entire bridal party and ensure everyone looks beautiful for your special day.',
            createdAt: '2024-01-21'
          },
          {
            id: 'offer_5',
            provider: {
              id: '5',
              name: 'Maria Santos',
              category: 'Beauty',
              rating: 4.6,
              profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg',
              location: 'Beirut',
              available: true
            },
            budget: {
              hasBudget: true,
              type: 'hourly',
              amount: 0,
              hourlyRate: 25
            },
            timing: {
              date: '2024-02-15',
              time: '2024-02-15T08:30:00'
            },
            message: 'Professional makeup artist with experience in wedding makeup. I can travel to your venue and provide services for the entire bridal party.',
            createdAt: '2024-01-22'
          }
        ]
      }
    ]
  },
  {
    id: 'group_3',
    title: 'Office Setup and Maintenance',
    description: 'Complete office setup including furniture assembly, IT setup, and ongoing maintenance services.',
    createdAt: '2024-01-12',
    userId: 'user_123',
    status: 'Finished',
    requests: [
      {
        id: 'group_req_3_1',
        category: 'Electrical',
        title: 'Office Network Setup',
        description: 'Install and configure office network, Wi-Fi, and computer systems for 10 employees.',
        timing: {
          type: 'urgent',
          day: '',
          timeSlot: ''
        },
        location: {
          city: 'Jounieh',
          street: 'Jounieh Bay',
          building: 'Office Building A',
          images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=400&fit=crop'
          ]
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 2000,
          hourlyRate: 0
        },
        providerSelection: {
          type: 'specific',
          selectedProvider: {
            id: '19',
            name: 'Omar Aboujaoude',
            category: 'Electrical',
            rating: 4.7,
            profilePicture: 'https://randomuser.me/api/portraits/men/29.jpg',
            location: 'Zahle',
            available: true
          }
        },
        status: 'Finished',
        groupId: 'group_3',
        createdAt: '2024-01-13'
      },
      {
        id: 'group_req_3_2',
        category: 'Cleaning',
        title: 'Office Cleaning Contract',
        description: 'Daily cleaning service for office space. Includes dusting, vacuuming, and bathroom maintenance.',
        timing: {
          type: 'flexible',
          day: 'Monday',
          timeSlot: 'Evening'
        },
        location: {
          city: 'Jounieh',
          street: 'Jounieh Bay',
          building: 'Office Building A',
          images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop'
          ]
        },
        budget: {
          hasBudget: true,
          type: 'hourly',
          amount: 0,
          hourlyRate: 20
        },
        providerSelection: {
          type: 'specific',
          selectedProvider: {
            id: '22',
            name: 'Fatima Hassan',
            category: 'Cleaning',
            rating: 4.1,
            profilePicture: 'https://randomuser.me/api/portraits/women/32.jpg',
            location: 'Jounieh',
            available: true
          }
        },
        status: 'Finished',
        groupId: 'group_3',
        createdAt: '2024-01-14'
      }
    ]
  }
];

// Helper function to get all requests (individual + group requests)
export const getAllUserRequests = () => {
  const individualRequests = userIndividualRequests;
  const groupRequests = userGroupWorks.flatMap(group => group.requests);
  return [...individualRequests, ...groupRequests];
};

// Helper function to get requests by status
export const getRequestsByStatus = (status) => {
  const allRequests = getAllUserRequests();
  return allRequests.filter(request => request.status === status);
};

// Helper function to get group requests count
export const getGroupRequestsCount = (groupId) => {
  const group = userGroupWorks.find(g => g.id === groupId);
  return group ? group.requests.length : 0;
};



// Helper function to get applied work by status
export const getAppliedWorkByStatus = (status) => {
  return userAppliedWork.filter(work => work.status === status);
};




// Dashboard statistics
export const getUserDashboardStats = () => {
  const allRequests = getAllUserRequests();
  const pendingRequests = getRequestsByStatus('Pending');
  const inProgressRequests = getRequestsByStatus('In Progress');
  const finishedRequests = getRequestsByStatus('Finished');
  const declinedRequests = getRequestsByStatus('Declined');
  
  return {
    totalRequests: allRequests.length,
    totalIndividualRequests: userIndividualRequests.length,
    totalGroups: userGroupWorks.length,
    totalGroupRequests: userGroupWorks.reduce((total, group) => total + group.requests.length, 0),
    pending: pendingRequests.length,
    inProgress: inProgressRequests.length,
    finished: finishedRequests.length,
    declined: declinedRequests.length
  };
};
