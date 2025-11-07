// Static data for user-made offers (offers made by the user as a provider)
export const userMadeOffersData = [
    {
      id: 'user_offer_1',
      request: {
        id: 'req_1',
        category: 'Electrical',
        title: 'Website Development for E-commerce Store',
        description: 'Need a professional e-commerce website with payment integration, inventory management, and admin panel.',
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
        status: 'pending'
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
        message: 'I have extensive experience in e-commerce development. I can create a modern, responsive website with all the requested features. I can start immediately and complete within 3 weeks.',
        status: 'active',
        createdAt: '2024-01-30'
      }
    },
    {
      id: 'user_offer_2',
      request: {
        id: 'req_2',
        category: 'Electrical',
        title: 'Office Electrical Installation',
        description: 'Need electrical work for new office space including lighting, outlets, and network cabling.',
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
        status: 'pending'
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
        message: 'I specialize in commercial electrical installations. I can handle the lighting, outlets, and network cabling efficiently. I estimate 20-25 hours of work.',
        status: 'active',
        createdAt: '2024-01-28'
      }
    },
    {
      id: 'user_offer_3',
      request: {
        id: 'req_3',
        category: 'Plumbing',
        title: 'Bathroom Renovation Plumbing',
        description: 'Complete bathroom renovation including new fixtures, pipes, and drainage system.',
        location: {
          city: 'Tripoli',
          street: 'Main Street',
          building: 'Apartment 8B',
          images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
          ]
        },
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 1500,
          hourlyRate: 0
        },
        status: 'in_progress'
      },
      userOffer: {
        id: 'user_offer_3',
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 1400,
          hourlyRate: 0
        },
        timing: {
          date: '2024-02-10',
          time: '2024-02-10T10:00:00'
        },
        message: 'I have 10+ years of experience in bathroom renovations. I can complete the plumbing work efficiently and ensure everything is up to code.',
        status: 'accepted',
        createdAt: '2024-01-25'
      }
    },
    {
      id: 'user_offer_4',
      request: {
        id: 'req_4',
        category: 'Handyman',
        title: 'Custom Kitchen Cabinets',
        description: 'Design and install custom kitchen cabinets with modern finish and hardware.',
        location: {
          city: 'Beirut',
          street: 'Achrafieh',
          building: 'Apartment 12C',
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
        status: 'pending'
      },
      userOffer: {
        id: 'user_offer_4',
        budget: {
          hasBudget: true,
          type: 'fixed',
          amount: 2300,
          hourlyRate: 0
        },
        timing: {
          date: '2024-02-25',
          time: '2024-02-25T14:00:00'
        },
        message: 'I specialize in custom kitchen cabinets with premium materials. I can design and install beautiful, functional cabinets that will last for years.',
        status: 'declined',
        createdAt: '2024-01-20'
      }
    }
  ];