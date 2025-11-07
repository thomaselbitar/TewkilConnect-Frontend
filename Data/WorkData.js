// Data/WorkData.js - Work data for WorkUserScreen
// Static data arrays for work management

// Work that user has applied to and taken (as a provider)
// These are requests sent to ALL providers, and the current user made an offer that was accepted
export const userAppliedWorkData = [
  {
    id: 'applied_work_1',
    request: {
      id: 'req_1',
      category: 'Electrical',
      title: 'E-commerce Website Development',
      description: 'Need a professional e-commerce website with payment integration, inventory management, and admin panel.',
      timing: {
        type: 'flexible',
        day: 'Monday',
        timeSlot: 'Morning'
      },
      location: {
        city: 'Beirut',
        street: 'Downtown',
        building: 'Office Building A',
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
        ]
      },
      budget: {
        hasBudget: true,
        type: 'fixed',
        amount: 3000,
        hourlyRate: 0
      },
      status: 'in_progress', // Current work status
      originalStatus: 'pending', // Original request status when it was posted
      createdAt: '2024-01-15',
      requestOwner: {
        id: 'owner_1',
        name: 'Sarah Johnson',
        profilePicture: 'https://randomuser.me/api/portraits/women/10.jpg',
        rating: 4.5
      }
    },
    userOffer: {
      id: 'user_offer_1',
      budget: {
        hasBudget: true,
        type: 'fixed',
        amount: 2800,
        hourlyRate: 0
      },
      timing: {
        date: '2024-02-20',
        time: '2024-02-20T09:00:00'
      },
      message: 'I have extensive experience in e-commerce development. I can create a modern, responsive website with all the requested features.',
      status: 'accepted',
      createdAt: '2024-01-30'
    }
  },
  {
    id: 'applied_work_2',
    request: {
      id: 'req_2',
      category: 'Electrical',
      title: 'Office Electrical Installation',
      description: 'Need electrical work for new office space including lighting, outlets, and network cabling.',
      timing: {
        type: 'urgent',
        day: '',
        timeSlot: ''
      },
      location: {
        city: 'Jounieh',
        street: 'Coastal Road',
        building: 'Business Center',
        images: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'
        ]
      },
      budget: {
        hasBudget: true,
        type: 'hourly',
        amount: 0,
        hourlyRate: 30
      },
      status: 'finished', // Current work status
      originalStatus: 'pending', // Original request status when it was posted
      createdAt: '2024-01-10',
      requestOwner: {
        id: 'owner_2',
        name: 'Mohammed Al-Rashid',
        profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg',
        rating: 4.2
      }
    },
    userOffer: {
      id: 'user_offer_2',
      budget: {
        hasBudget: true,
        type: 'hourly',
        amount: 0,
        hourlyRate: 28
      },
      timing: {
        date: '2024-02-15',
        time: '2024-02-15T08:00:00'
      },
      message: 'I specialize in commercial electrical installations. I can handle the lighting, outlets, and network cabling efficiently.',
      status: 'accepted',
      createdAt: '2024-01-28'
    }
  }
];

// Work requests sent to the current user (as a provider)
// These are requests sent specifically to the current user who needs to take action
export const workSentToUserData = [
  {
    id: 'sent_work_1',
    category: 'Electrical',
    title: 'Mobile App Development',
    description: 'Need a mobile app for my restaurant with ordering, payment, and delivery tracking features.',
    timing: {
      type: 'flexible',
      day: 'Monday',
      timeSlot: 'Morning'
    },
    location: {
      city: 'Beirut',
      street: 'Hamra Street',
      building: 'Restaurant Building',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 5000,
      hourlyRate: 0
    },
    status: 'pending', // User needs to take action (accept, decline, make offer)
    createdAt: '2024-01-20',
    requestOwner: {
      id: 'owner_4',
      name: 'Ahmad Al-Rashid',
      profilePicture: 'https://randomuser.me/api/portraits/men/30.jpg',
      rating: 4.3
    }
  },
  {
    id: 'sent_work_2',
    category: 'Electrical',
    title: 'Smart Home Installation',
    description: 'Install smart lighting, security cameras, and automated door locks in my villa.',
    timing: {
      type: 'urgent',
      day: '',
      timeSlot: ''
    },
    location: {
      city: 'Jounieh',
      street: 'Coastal Villa',
      building: 'Villa 25',
      images: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'hourly',
      amount: 0,
      hourlyRate: 35
    },
    status: 'pending', // User needs to take action (accept, decline, make offer)
    createdAt: '2024-01-18',
    requestOwner: {
      id: 'owner_5',
      name: 'Layla Mansour',
      profilePicture: 'https://randomuser.me/api/portraits/women/35.jpg',
      rating: 4.7
    }
  },
  {
    id: 'sent_work_3',
    category: 'Plumbing',
    title: 'Kitchen Plumbing Repair',
    description: 'Fix leaking kitchen sink and install new garbage disposal unit.',
    timing: {
      type: 'flexible',
      day: 'Wednesday',
      timeSlot: 'Afternoon'
    },
    location: {
      city: 'Beirut',
      street: 'Achrafieh',
      building: 'Apartment 15B',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 300,
      hourlyRate: 0
    },
    status: 'in_progress', // Work is currently in progress
    createdAt: '2024-01-15',
    requestOwner: {
      id: 'owner_6',
      name: 'Omar Khalil',
      profilePicture: 'https://randomuser.me/api/portraits/men/40.jpg',
      rating: 4.1
    }
  },
  {
    id: 'sent_work_4',
    category: 'Handyman',
    title: 'Custom Kitchen Cabinets',
    description: 'Design and install custom kitchen cabinets with modern finish and hardware.',
    timing: {
      type: 'flexible',
      day: 'Friday',
      timeSlot: 'Morning'
    },
    location: {
      city: 'Tripoli',
      street: 'Main Street',
      building: 'House 45',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 2500,
      hourlyRate: 0
    },
    status: 'finished', // Work is completed
    createdAt: '2024-01-05',
    requestOwner: {
      id: 'owner_7',
      name: 'Fatima Hassan',
      profilePicture: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 4.8
    }
  },
  {
    id: 'sent_work_5',
    category: 'Beauty',
    title: 'Wedding Photography',
    description: 'Need professional wedding photography for a 200-guest wedding ceremony and reception.',
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
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 2000,
      hourlyRate: 0
    },
    status: 'declined', // Provider declined this request
    createdAt: '2024-01-12',
    requestOwner: {
      id: 'owner_8',
      name: 'Nour Al-Zahra',
      profilePicture: 'https://randomuser.me/api/portraits/women/50.jpg',
      rating: 4.6
    }
  },
  {
    id: 'sent_work_6',
    category: 'Catering Services',
    title: 'Corporate Event Catering',
    description: 'Need catering for a corporate event with 100 guests. Finger foods and beverages required.',
    timing: {
      type: 'urgent'
    },
    location: {
      city: 'Beirut',
      street: 'Downtown',
      building: 'Conference Center',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      ]
    },
    budget: {
      hasBudget: true,
      type: 'fixed',
      amount: 1500,
      hourlyRate: 0
    },
    status: 'declined', // Provider declined this request
    createdAt: '2024-01-08',
    requestOwner: {
      id: 'owner_9',
      name: 'Khalil Mansour',
      profilePicture: 'https://randomuser.me/api/portraits/men/55.jpg',
      rating: 4.4
    }
  }
];
