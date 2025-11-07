// User Posts Data - Simulates API response for user's own posts
export const userPostsData = [
  {
    id: '1',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userType: 'provider'
    },
    caption: 'Just finished an amazing home renovation project! The before and after is incredible. #homeimprovement #renovation',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isLiked: true,
    likesCount: 42,
    tags: ['renovation', 'remodel', 'upgrade', 'repair', 'kitchen', 'bathroom', 'tiles'],
    media: [
      {
        type: 'image',
        url: require('../assets/images/Posts/TestPost.jpg')
      }
    ]
  },
  {
    id: '2',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userType: 'provider'
    },
    caption: 'Working on some new techniques in the workshop today. Always learning something new! 🔨 #diy #workshop #learning',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isLiked: false,
    likesCount: 18,
    tags: ['handyman', 'fix', 'smalljobs', 'maintenance', 'mount', 'tools', 'repair'],
    media: [
      {
        type: 'video',
        url: require('../assets/images/Videos/v1.mp4'),
        aspectRatio: 'square'
      }
    ]
  },
  {
    id: '3',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userType: 'provider'
    },
    caption: 'Beautiful sunset from the job site today. Sometimes the best part of the work is the view! 🌅 #sunset #construction #beautiful',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isLiked: true,
    likesCount: 67,
    tags: ['renovation', 'remodel', 'upgrade', 'repair', 'kitchen', 'bathroom', 'tiles'],
    media: [
      {
        type: 'video',
        url: require('../assets/images/Videos/v2.mp4'),
        aspectRatio: 'vertical'
      }
    ]
  },
  {
    id: '4',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userType: 'provider'
    },
    caption: 'Team work makes the dream work! Great collaboration with the crew today. #teamwork #construction #collaboration',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    isLiked: false,
    likesCount: 23,
    tags: ['renovation', 'remodel', 'upgrade', 'repair', 'kitchen', 'bathroom', 'tiles'],
    media: [
      {
        type: 'video',
        url: require('../assets/images/Videos/v4.mp4'),
        aspectRatio: 'horizontal'
      }
    ]
  },
  {
    id: '5',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userType: 'provider'
    },
    caption: 'Before and after of the kitchen renovation. The transformation is incredible! #kitchen #renovation #beforeandafter',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    isLiked: true,
    likesCount: 89,
    tags: ['renovation', 'remodel', 'upgrade', 'repair', 'kitchen', 'bathroom', 'tiles'],
    media: [
      {
        type: 'video',
        url: require('../assets/images/Videos/v6.mp4'),
        aspectRatio: 'square'
      }
    ]
  },
  {
    id: '6',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userType: 'provider'
    },
    caption: 'New project starting tomorrow! Excited to share the progress with you all. #newproject #excited #construction',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    isLiked: false,
    likesCount: 15,
    tags: ['renovation', 'remodel', 'upgrade', 'repair', 'kitchen', 'bathroom', 'tiles'],
    media: [
      {
        type: 'video',
        url: require('../assets/images/Videos/v8.mp4'),
        aspectRatio: 'vertical'
      }
    ]
  },
  {
    id: '7',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userType: 'provider'
    },
    caption: 'Step-by-step process of our latest bathroom renovation! Swipe to see the transformation from start to finish. #bathroom #renovation #beforeandafter #stepbystep',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    isLiked: true,
    likesCount: 156,
    tags: ['renovation', 'remodel', 'upgrade', 'repair', 'kitchen', 'bathroom', 'tiles'],
    media: [
      {
        type: 'image',
        url: require('../assets/images/Posts/TestPost.jpg')
      },
      {
        type: 'image',
        url: require('../assets/images/Posts/TestPost.jpg')
      },
      {
        type: 'image',
        url: require('../assets/images/Posts/TestPost.jpg')
      },
      {
        type: 'image',
        url: require('../assets/images/Posts/TestPost.jpg')
      }
    ]
  }
];

// Helper function to get user posts (simulates API call)
export const getUserPosts = () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(userPostsData);
    }, 500);
  });
};

// Helper function to get user posts count
export const getUserPostsCount = () => {
  return userPostsData.length;
};

// Helper function to delete a post (simulates API call)
export const deleteUserPost = (postId) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const index = userPostsData.findIndex(post => post.id === postId);
      if (index > -1) {
        userPostsData.splice(index, 1);
        resolve({ success: true, message: 'Post deleted successfully' });
      } else {
        resolve({ success: false, message: 'Post not found' });
      }
    }, 300);
  });
};
