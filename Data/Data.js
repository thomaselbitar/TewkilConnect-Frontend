// data/data.js
import { categories } from './CategoryandTag.js';

// Re-export categories from centralized file
export { categories };
export const providers = [
  // Cleaning
  { id: '1', name: 'John Doe', category: 'Cleaning', rating: 1.5, profilePicture: 'https://randomuser.me/api/portraits/men/11.jpg', location: 'Beirut', available: true },
  { id: '2', name: 'Mark Green', category: 'Cleaning', rating: 2.3, profilePicture: 'https://randomuser.me/api/portraits/men/12.jpg', location: 'Tripoli', available: true },
  { id: '3', name: 'Khaled Nour', category: 'Cleaning', rating: 3.2, profilePicture: 'https://randomuser.me/api/portraits/men/13.jpg', location: 'Sidon', available: false },
  { id: '4', name: 'Salim Tarek', category: 'Cleaning', rating: 4.1, profilePicture: 'https://randomuser.me/api/portraits/men/14.jpg', location: 'Beirut', available: true },
  { id: '5', name: 'Rami Said', category: 'Cleaning', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg', location: 'Zahle', available: true },

  // Plumbing
  { id: '6', name: 'Sarah Smith', category: 'Plumbing', rating: 1.8, profilePicture: 'https://randomuser.me/api/portraits/women/16.jpg', location: 'Tripoli', available: true },
  { id: '7', name: 'Hani Wehbe', category: 'Plumbing', rating: 2.7, profilePicture: 'https://randomuser.me/api/portraits/men/17.jpg', location: 'Beirut', available: true },
  { id: '8', name: 'Layla Osman', category: 'Plumbing', rating: 3.5, profilePicture: 'https://randomuser.me/api/portraits/women/18.jpg', location: 'Jounieh', available: true },
  { id: '9', name: 'Walid Darwish', category: 'Plumbing', rating: 4.3, profilePicture: 'https://randomuser.me/api/portraits/men/19.jpg', location: 'Saida', available: true },
  { id: '10', name: 'Maya Khoury', category: 'Plumbing', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/20.jpg', location: 'Byblos', available: true },

  // Electrical
  { id: '11', name: 'Ali Ahmad', category: 'Electrical', rating: 1.2, profilePicture: 'https://randomuser.me/api/portraits/men/21.jpg', location: 'Sidon', available: true },
  { id: '12', name: 'Karim Tamer', category: 'Electrical', rating: 2.1, profilePicture: 'https://randomuser.me/api/portraits/men/22.jpg', location: 'Tripoli', available: true },
  { id: '13', name: 'Fadi Gerges', category: 'Electrical', rating: 3.8, profilePicture: 'https://randomuser.me/api/portraits/men/23.jpg', location: 'Beirut', available: false },
  { id: '14', name: 'Rami Chahrour', category: 'Electrical', rating: 4.6, profilePicture: 'https://randomuser.me/api/portraits/men/24.jpg', location: 'Jounieh', available: true },
  { id: '15', name: 'Ziad Haddad', category: 'Electrical', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/men/25.jpg', location: 'Saida', available: true },

  // Painting
  { id: '16', name: 'Layla Khalil', category: 'Painting', rating: 1.9, profilePicture: 'https://randomuser.me/api/portraits/women/26.jpg', location: 'Beirut', available: true },
  { id: '17', name: 'Tarek Itani', category: 'Painting', rating: 2.4, profilePicture: 'https://randomuser.me/api/portraits/men/27.jpg', location: 'Beirut', available: true },
  { id: '18', name: 'Rita Najm', category: 'Painting', rating: 3.1, profilePicture: 'https://randomuser.me/api/portraits/women/28.jpg', location: 'Tripoli', available: true },
  { id: '19', name: 'Omar Aboujaoude', category: 'Painting', rating: 4.7, profilePicture: 'https://randomuser.me/api/portraits/men/29.jpg', location: 'Zahle', available: true },
  { id: '20', name: 'Sara Nasser', category: 'Painting', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/30.jpg', location: 'Sidon', available: true },

  // Renovation
  { id: '21', name: 'Hassan Fares', category: 'Renovation', rating: 1.3, profilePicture: 'https://randomuser.me/api/portraits/men/31.jpg', location: 'Zahle', available: true },
  { id: '22', name: 'Rita Fares', category: 'Renovation', rating: 2.8, profilePicture: 'https://randomuser.me/api/portraits/women/32.jpg', location: 'Tripoli', available: true },
  { id: '23', name: 'Samir Daher', category: 'Renovation', rating: 3.6, profilePicture: 'https://randomuser.me/api/portraits/men/33.jpg', location: 'Beirut', available: true },
  { id: '24', name: 'Mira Haddad', category: 'Renovation', rating: 4.2, profilePicture: 'https://randomuser.me/api/portraits/women/34.jpg', location: 'Byblos', available: true },
  { id: '25', name: 'Fouad Nader', category: 'Renovation', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/men/35.jpg', location: 'Sidon', available: true },

  // Barber
  { id: '26', name: 'Maya Saba', category: 'Barber', rating: 1.7, profilePicture: 'https://randomuser.me/api/portraits/women/36.jpg', location: 'Beirut', available: true },
  { id: '27', name: 'Karim Darwish', category: 'Barber', rating: 2.5, profilePicture: 'https://randomuser.me/api/portraits/men/37.jpg', location: 'Tripoli', available: true },
  { id: '28', name: 'Nada Itani', category: 'Barber', rating: 3.3, profilePicture: 'https://randomuser.me/api/portraits/women/38.jpg', location: 'Sidon', available: true },
  { id: '29', name: 'Samir Aoun', category: 'Barber', rating: 4.8, profilePicture: 'https://randomuser.me/api/portraits/men/39.jpg', location: 'Jounieh', available: true },
  { id: '30', name: 'Sara Rizk', category: 'Barber', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/40.jpg', location: 'Beirut', available: true },

  // Beauty
  { id: '31', name: 'Tarek Nassar', category: 'Beauty', rating: 1.4, profilePicture: 'https://randomuser.me/api/portraits/men/41.jpg', location: 'Byblos', available: true },
  { id: '32', name: 'Ahmad Saad', category: 'Plumbing', rating: 2.6, profilePicture: 'https://randomuser.me/api/portraits/men/42.jpg', location: 'Beirut', available: true },
  { id: '33', name: 'Mohammad Fakhoury', category: 'Plumbing', rating: 3.9, profilePicture: 'https://randomuser.me/api/portraits/men/43.jpg', location: 'Tripoli', available: true },
  { id: '34', name: 'Rana Nassar', category: 'Plumbing', rating: 4.4, profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg', location: 'Sidon', available: true },
  { id: '35', name: 'Nour Atallah', category: 'Plumbing', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/45.jpg', location: 'Jounieh', available: true },

  // Babysitting
  { id: '36', name: 'Rana Melhem', category: 'Babysitting', rating: 1.1, profilePicture: 'https://randomuser.me/api/portraits/women/46.jpg', location: 'Tripoli', available: true },
  { id: '37', name: 'Mira Tannous', category: 'Babysitting', rating: 2.2, profilePicture: 'https://randomuser.me/api/portraits/women/47.jpg', location: 'Beirut', available: true },
  { id: '38', name: 'Lina Azar', category: 'Babysitting', rating: 3.4, profilePicture: 'https://randomuser.me/api/portraits/women/48.jpg', location: 'Sidon', available: true },
  { id: '39', name: 'Dina Hobeika', category: 'Babysitting', rating: 4.5, profilePicture: 'https://randomuser.me/api/portraits/women/49.jpg', location: 'Byblos', available: true },
  { id: '40', name: 'Fatima Sabeh', category: 'Babysitting', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/50.jpg', location: 'Beirut', available: true },

  // Beauty
  { id: '41', name: 'Fouad Khoury', category: 'Beauty', rating: 1.6, profilePicture: 'https://randomuser.me/api/portraits/men/51.jpg', location: 'Saida', available: true },
  { id: '42', name: 'Layal Ghanem', category: 'Beauty', rating: 2.9, profilePicture: 'https://randomuser.me/api/portraits/women/52.jpg', location: 'Jounieh', available: true },
  { id: '43', name: 'Sami Hitti', category: 'Beauty', rating: 3.7, profilePicture: 'https://randomuser.me/api/portraits/men/53.jpg', location: 'Beirut', available: true },
  { id: '44', name: 'Dana Mokbel', category: 'Beauty', rating: 4.1, profilePicture: 'https://randomuser.me/api/portraits/women/54.jpg', location: 'Tripoli', available: true },
  { id: '45', name: 'Naji Chami', category: 'Beauty', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/men/55.jpg', location: 'Sidon', available: true },

  // Moving
  { id: '46', name: 'Dina Hobeika', category: 'Moving', rating: 1.2, profilePicture: 'https://randomuser.me/api/portraits/women/56.jpg', location: 'Beirut', available: true },
  { id: '47', name: 'Fadi Nader', category: 'Moving', rating: 2.3, profilePicture: 'https://randomuser.me/api/portraits/men/57.jpg', location: 'Tripoli', available: true },
  { id: '48', name: 'Wassim Abou Jaoude', category: 'Moving', rating: 3.8, profilePicture: 'https://randomuser.me/api/portraits/men/58.jpg', location: 'Sidon', available: true },
  { id: '49', name: 'Zeina Najm', category: 'Moving', rating: 4.6, profilePicture: 'https://randomuser.me/api/portraits/women/59.jpg', location: 'Jounieh', available: true },
  { id: '50', name: 'Amir Hage', category: 'Moving', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/men/60.jpg', location: 'Beirut', available: true },

  // Gardening
  { id: '51', name: 'Sami Rizk', category: 'Gardening', rating: 1.8, profilePicture: 'https://randomuser.me/api/portraits/men/61.jpg', location: 'Beirut', available: true },
  { id: '52', name: 'Majed Chidiac', category: 'Gardening', rating: 2.4, profilePicture: 'https://randomuser.me/api/portraits/men/62.jpg', location: 'Tripoli', available: true },
  { id: '53', name: 'Dana Kassab', category: 'Gardening', rating: 3.2, profilePicture: 'https://randomuser.me/api/portraits/women/63.jpg', location: 'Sidon', available: true },
  { id: '54', name: 'Mounir Fayad', category: 'Gardening', rating: 4.3, profilePicture: 'https://randomuser.me/api/portraits/men/64.jpg', location: 'Byblos', available: true },
  { id: '55', name: 'Yara Fares', category: 'Gardening', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg', location: 'Jounieh', available: true },

  // Beauty
  { id: '56', name: 'Nour El Hajj', category: 'Beauty', rating: 1.5, profilePicture: 'https://randomuser.me/api/portraits/women/66.jpg', location: 'Beirut', available: true },
  { id: '57', name: 'Rita Nassar', category: 'Beauty', rating: 2.7, profilePicture: 'https://randomuser.me/api/portraits/women/67.jpg', location: 'Tripoli', available: true },
  { id: '58', name: 'Dina Khalil', category: 'Beauty', rating: 3.5, profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg', location: 'Sidon', available: true },
  { id: '59', name: 'Jessica Matar', category: 'Beauty', rating: 4.8, profilePicture: 'https://randomuser.me/api/portraits/women/69.jpg', location: 'Byblos', available: true },
  { id: '60', name: 'Christina Saab', category: 'Beauty', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/70.jpg', location: 'Jounieh', available: true },

  // Massage
  { id: '61', name: 'Zeinab Daouk', category: 'Massage', rating: 1.3, profilePicture: 'https://randomuser.me/api/portraits/women/71.jpg', location: 'Beirut', available: true },
  { id: '62', name: 'Rami Hatem', category: 'Massage', rating: 2.6, profilePicture: 'https://randomuser.me/api/portraits/men/72.jpg', location: 'Tripoli', available: true },
  { id: '63', name: 'Maya Hayek', category: 'Massage', rating: 3.9, profilePicture: 'https://randomuser.me/api/portraits/women/73.jpg', location: 'Sidon', available: true },
  { id: '64', name: 'Omar Barakat', category: 'Massage', rating: 4.4, profilePicture: 'https://randomuser.me/api/portraits/men/74.jpg', location: 'Byblos', available: true },
  { id: '65', name: 'Yasmina Raad', category: 'Massage', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/75.jpg', location: 'Jounieh', available: true },

  // Cleaning
  { id: '66', name: 'Ahmad Sleiman', category: 'Cleaning', rating: 1.4, profilePicture: 'https://randomuser.me/api/portraits/men/76.jpg', location: 'Beirut', available: true },
  { id: '67', name: 'Fouad Zahran', category: 'Cleaning', rating: 2.8, profilePicture: 'https://randomuser.me/api/portraits/men/77.jpg', location: 'Tripoli', available: true },
  { id: '68', name: 'Rita Aboud', category: 'Cleaning', rating: 3.6, profilePicture: 'https://randomuser.me/api/portraits/women/78.jpg', location: 'Sidon', available: true },
  { id: '69', name: 'Salwa Darwish', category: 'Cleaning', rating: 4.2, profilePicture: 'https://randomuser.me/api/portraits/women/79.jpg', location: 'Byblos', available: true },
  { id: '70', name: 'Nader Rahme', category: 'Cleaning', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/men/80.jpg', location: 'Jounieh', available: true },

  // AC & HVAC
  { id: '71', name: 'Jad Farah', category: 'AC & HVAC', rating: 1.7, profilePicture: 'https://randomuser.me/api/portraits/men/81.jpg', location: 'Beirut', available: true },
  { id: '72', name: 'Bilal Oueidat', category: 'AC & HVAC', rating: 2.5, profilePicture: 'https://randomuser.me/api/portraits/men/82.jpg', location: 'Tripoli', available: true },
  { id: '73', name: 'Karim Tawk', category: 'AC & HVAC', rating: 3.3, profilePicture: 'https://randomuser.me/api/portraits/men/83.jpg', location: 'Sidon', available: true },
  { id: '74', name: 'Hassan Daher', category: 'AC & HVAC', rating: 4.7, profilePicture: 'https://randomuser.me/api/portraits/men/84.jpg', location: 'Byblos', available: true },
  { id: '75', name: 'Youssef Barghout', category: 'AC & HVAC', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/men/85.jpg', location: 'Jounieh', available: true },

  // Beauty
  { id: '76', name: 'Nour Hanna', category: 'Beauty', rating: 1.2, profilePicture: 'https://randomuser.me/api/portraits/women/86.jpg', location: 'Beirut', available: true },
  { id: '77', name: 'Rola Saba', category: 'Beauty', rating: 2.9, profilePicture: 'https://randomuser.me/api/portraits/women/87.jpg', location: 'Tripoli', available: true },
  { id: '78', name: 'Jana Nasr', category: 'Beauty', rating: 3.8, profilePicture: 'https://randomuser.me/api/portraits/women/88.jpg', location: 'Sidon', available: true },
  { id: '79', name: 'Jessica Abou Rizk', category: 'Beauty', rating: 4.5, profilePicture: 'https://randomuser.me/api/portraits/women/89.jpg', location: 'Byblos', available: true },
  { id: '80', name: 'Carla Gebran', category: 'Beauty', rating: 5.0, profilePicture: 'https://randomuser.me/api/portraits/women/90.jpg', location: 'Jounieh', available: true },
];



export const sampleUsers = [
  {
    firstName: "Maya",
    lastName: "Nassar",
    userType: "provider",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: true,
    iFollow: false,
  },
  {
    firstName: "Karim",
    lastName: "Saleh",
    userType: "seeker",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: true,
    iFollow: true,
  },
  {
    firstName: "Layal",
    lastName: "Haddad",
    userType: "provider",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: false,
    iFollow: true,
  },
  {
    firstName: "Nour",
    lastName: "Fares",
    userType: "seeker",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: true,
    iFollow: false,
  },
  {
    firstName: "Tarek",
    lastName: "Abdallah",
    userType: "provider",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: false,
    iFollow: false,
  },
  {
    firstName: "Jana",
    lastName: "Nasr",
    userType: "seeker",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: true,
    iFollow: true,
  },
  {
    firstName: "Omar",
    lastName: "Hamdan",
    userType: "provider",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: false,
    iFollow: false,
  },
  {
    firstName: "Rita",
    lastName: "Moukarzel",
    userType: "seeker",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: true,
    iFollow: false,
  },
  {
    firstName: "Fadi",
    lastName: "Sleiman",
    userType: "provider",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: false,
    iFollow: true,
  },
  {
    firstName: "Sara",
    lastName: "Zein",
    userType: "seeker",
    profileImage: require('../assets/images/Profile/defaultProfile.jpg'),
    isFollowingMe: true,
    iFollow: false,
  },
];

export const samplePosts = [
  {
    "id": 6,
    "user": {
      "firstName": "Tarek",
      "lastName": "Abdallah",
      "profileImage": "https://randomuser.me/api/portraits/men/88.jpg",
      "userType": "provider"
    },
    "caption": "Brand new post! Welcome to the community 🚀",
    "media": [
      {
        "type": "image",
        "url": require('../assets/images/Posts/TestPost.jpg')
      }
    ],
    "likesCount": 1,
    "isLiked": false,
    "tags": ["beauty", "makeup", "nails", "salon", "style", "selfcare", "treatment"],
    // 5 minutes ago
    "timestamp": "2024-07-12T09:55:00.000Z"
  },
  {
    "id": 1,
    "user": {
      "firstName": "Maya",
      "lastName": "Nassar",
      "profileImage": "https://randomuser.me/api/portraits/women/45.jpg",
      "userType": "provider"
    },
    "caption": "Behind the scenes of today's shoot 🎬📸",
    "media": [
      {
        "type": "image",
        "url": require('../assets/images/Posts/TestPost.jpg')
      },
      {
        "type": "image",
        "url": require('../assets/images/Posts/TestPost.jpg')
      }
    ],
    "likesCount": 245,
    "isLiked": true,
    "tags": ["beauty", "makeup", "nails", "salon", "style", "selfcare", "treatment"],
    // 2 hours ago
    "timestamp": "2024-07-12T08:00:00.000Z"
  },
  {
    "id": 2,
    "user": {
      "firstName": "Karim",
      "lastName": "Saleh",
      "profileImage": "https://randomuser.me/api/portraits/men/32.jpg",
      "userType": "seeker"
    },
    "caption": "Amazing service from Maya! Highly recommended 👏",
    "media": [
      {
        "type": "image",
        "url": require('../assets/images/Posts/TestPost.jpg')
      }
    ],
    "likesCount": 89,
    "isLiked": false,
    "tags": ["beauty", "makeup", "nails", "salon", "style", "selfcare", "treatment"],
    // 3 days ago
    "timestamp": "2024-07-09T10:00:00.000Z"
  },
  {
    "id": 3,
    "user": {
      "firstName": "Layal",
      "lastName": "Haddad",
      "profileImage": "https://randomuser.me/api/portraits/women/68.jpg",
      "userType": "provider"
    },
    "caption": "New hairstyle collection coming soon! 💇‍♀️✨",
    "media": [
      {
        "type": "image",
        "url": require('../assets/images/Posts/TestPost.jpg')
      },
      {
        "type": "image",
        "url": require('../assets/images/Posts/TestPost.jpg')
      }
    ],
    "likesCount": 156,
    "isLiked": true,
    "tags": ["barber", "haircut", "fade", "shave", "trim", "style", "grooming"],
    // 10 days ago (same year)
    "timestamp": "2024-07-02T10:00:00.000Z"
  },
  {
    "id": 4,
    "user": {
      "firstName": "Ahmad",
      "lastName": "Khalil",
      "profileImage": "https://randomuser.me/api/portraits/men/55.jpg",
      "userType": "provider"
    },
    "caption": "Check out this amazing tutorial! 🎥✨",
    "media": [
      {
        "type": "video",
        "url": require('../assets/images/Videos/v2.mp4')
      }
    ],
    "likesCount": 312,
    "isLiked": false,
    "tags": ["handyman", "fix", "smalljobs", "maintenance", "mount", "tools", "repair"],
    // Last year (2023)
    "timestamp": "2023-07-12T10:00:00.000Z"
  },
  {
    "id": 5,
    "user": {
      "firstName": "Nour",
      "lastName": "Fares",
      "profileImage": "https://randomuser.me/api/portraits/women/77.jpg",
      "userType": "seeker"
    },
    "caption": "Just joined! Excited to see everyone's posts! 🌟",
    "media": [
      {
        "type": "image",
        "url": require('../assets/images/Posts/TestPost.jpg')
      }
    ],
    "likesCount": 12,
    "isLiked": false,
    "tags": ["beauty", "makeup", "nails", "salon", "style", "selfcare", "treatment"],
    "timestamp": "2025-07-03T09:00:00Z"
  },
  {
    "id": 7,
    "user": {
      "firstName": "Sara",
      "lastName": "Zein",
      "profileImage": "https://randomuser.me/api/portraits/women/40.jpg",
      "userType": "provider"
    },
    "caption": "Quick tips for home repairs! 🛠️ Watch this.",
    "media": [
      {
        "type": "video",
        "url": require('../assets/images/Videos/v1.mp4')
      }
    ],
    "likesCount": 45,
    "isLiked": false,
    "tags": ["handyman", "fix", "smalljobs", "maintenance", "mount", "tools", "repair"],
    "timestamp": "2025-07-05T11:00:00Z"
  },

  {
    "id": 9,
    "user": {
      "firstName": "Layal",
      "lastName": "Haddad",
      "profileImage": "https://randomuser.me/api/portraits/women/68.jpg",
      "userType": "provider"
    },
    "caption": "Watch how I style hair for summer! ☀️💇‍♀️",
    "media": [
      {
        "type": "video",
        "url": require('../assets/images/Videos/v4.mp4')
      }
    ],
    "likesCount": 67,
    "isLiked": false,
    "tags": ["barber", "haircut", "fade", "shave", "trim", "style", "grooming"],
    "timestamp": "2025-07-05T13:00:00Z"
  },
  {
    "id": 10,
    "user": {
      "firstName": "Ahmad",
      "lastName": "Khalil",
      "profileImage": "https://randomuser.me/api/portraits/men/55.jpg",
      "userType": "provider"
    },
    "caption": "Full tutorial: How to fix a leaky faucet! 💧",
    "media": [
      {
        "type": "video",
        "url": require('../assets/images/Videos/v6.mp4')
      }
    ],
    "likesCount": 88,
    "isLiked": true,
    "tags": ["plumber", "pipes", "leak", "sink", "toilet", "faucet", "bathroom"],
    "timestamp": "2025-07-05T14:00:00Z"
  },
  {
    "id": 11,
    "user": {
      "firstName": "Maya",
      "lastName": "Nassar",
      "profileImage": "https://randomuser.me/api/portraits/women/45.jpg",
      "userType": "provider"
    },
    "caption": "Behind the scenes: My latest project! 🎥",
    "media": [
      {
        "type": "video",
        "url": require('../assets/images/Videos/v8.mp4')
      }
    ],
    "likesCount": 54,
    "isLiked": false,
    "tags": ["beauty", "makeup", "nails", "salon", "style", "selfcare", "treatment"],
    "timestamp": "2025-07-05T15:00:00Z"
  },
];


export const requests = [
  // Handyman
  {
    id: '1',
    status: 'pending',
    groupId: 'grp-tech-1',
    category: 'Handyman',
    title: 'Fix washing machine',
    description: 'Washer not spinning. Need quick help.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Beirut', street: 'Hamra Street', building: 'Building 12', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 100, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null },
    requestOwner: {
      id: 'owner_1',
      name: 'Sarah Johnson',
      profilePicture: 'https://randomuser.me/api/portraits/women/10.jpg',
      rating: 4.5
    }
  },
  {
    id: '2',
    status: 'pending',
    groupId: '',
    category: 'Handyman',
    title: 'Fix TV',
    description: 'TV black screen problem.',
    timing: { type: 'flexible', day: 'Tuesday', timeSlot: 'evening' },
    location: { city: 'Tripoli', street: 'Main Road', building: 'Block A', images: ['https://images.unsplash.com/photo-1592595896552-29b75c932b3a?auto=format&fit=crop&w=640&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 60, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null },
    requestOwner: {
      id: 'owner_2',
      name: 'Mohammed Al-Rashid',
      profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg',
      rating: 4.2
    }
  },

  // Electrical
  {
    id: '6',
    status: 'pending',
    groupId: 'grp-elec-1',
    category: 'Electrical',
    title: 'Ceiling fan installation',
    description: 'Install 2 ceiling fans.',
    timing: { type: 'flexible', day: 'Saturday', timeSlot: 'afternoon' },
    location: { city: 'Jounieh', street: 'Coastal Road', building: 'Tower 3', images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 80, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null },
    requestOwner: {
      id: 'owner_3',
      name: 'Fatima Hassan',
      profilePicture: 'https://randomuser.me/api/portraits/women/12.jpg',
      rating: 4.8,
      isProvider: true,
      providerCategory: 'Plumbing'
    }
  },
  {
    id: '7',
    status: 'pending',
    groupId: '',
    category: 'Electrical',
    title: 'Fix power outage',
    description: 'No electricity in one room.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Beirut', street: 'Gemmayzeh', building: 'House 45', images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80' , 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 100, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null },
    requestOwner: {
      id: 'owner_4',
      name: 'Ahmad Al-Rashid',
      profilePicture: 'https://randomuser.me/api/portraits/men/30.jpg',
      rating: 4.3,
      isProvider: true,
      providerCategory: 'Electrical'
    }
  },

  // Car Mechanic
  {
    id: '11',
    status: 'pending',
    groupId: 'grp-mech-1',
    category: 'Car Mechanic',
    title: 'Oil change and tire rotation',
    description: 'Need basic car maintenance service.',
    timing: { type: 'flexible', day: 'Thursday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Corniche Road', building: 'Garage A', images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 100, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null },
    requestOwner: {
      id: 'owner_5',
      name: 'Layla Mansour',
      profilePicture: 'https://randomuser.me/api/portraits/women/35.jpg',
      rating: 4.7,
      isProvider: true,
      providerCategory: 'Electrical'
    }
  },
  {
    id: '12',
    status: 'pending',
    groupId: '',
    category: 'Car Mechanic',
    title: 'Brake pad replacement',
    description: 'Car brake pads need replacement.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Garage Street', building: 'Workshop B', images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=640&q=80' , 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 200, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null },
    requestOwner: {
      id: 'owner_6',
      name: 'Omar Khalil',
      profilePicture: 'https://randomuser.me/api/portraits/men/40.jpg',
      rating: 4.1,
      isProvider: true,
      providerCategory: 'Car Mechanic'
    }
  },

  // Electrical
  {
    id: '16',
    status: 'pending',
    groupId: 'grp-it-1',
    category: 'Electrical',
    title: 'Setup Wi-Fi network',
    description: 'Need to setup routers and connections.',
    timing: { type: 'flexible', day: 'Friday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Downtown', building: 'Office 5', images: ['https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 100, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '17',
    status: 'pending',
    groupId: '',
    category: 'Electrical',
    title: 'Laptop slow, need cleanup',
    description: 'Laptop running slow, maybe virus.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Tech Road', building: 'Suite 3', images: [ 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 80, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Barber
  {
    id: '21',
    status: 'pending',
    groupId: 'grp-hair-1',
    category: 'Barber',
    title: 'Wedding hair styling',
    description: 'Need a wedding hairstyle.',
    timing: { type: 'flexible', day: 'Wednesday', timeSlot: 'afternoon' },
    location: { city: 'Beirut', street: 'Hamra', building: 'Salon A', images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 200, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '22',
    status: 'pending',
    groupId: '',
    category: 'Barber',
    title: 'Hair coloring and treatment',
    description: 'Coloring and keratin treatment.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Main Street', building: 'Salon B', images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=640&q=80' , 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 150, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Massage
  {
    id: '26',
    status: 'pending',
    groupId: 'grp-train-1',
    category: 'Massage',
    title: 'Weight loss training program',
    description: '3-months training program for weight loss.',
    timing: { type: 'flexible', day: 'Monday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Fitness St', building: 'Gym 1', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 300, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '27',
    status: 'pending',
    groupId: '',
    category: 'Massage',
    title: 'Personal gym trainer',
    description: 'Need a trainer at gym for 1 hour daily.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Gym Street', building: 'Fitness Center', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=640&q=80' , 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 400, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Plumbing
  {
    id: '31',
    status: 'pending',
    groupId: 'grp-plumb-1',
    category: 'Plumbing',
    title: 'Bathroom pipe leakage',
    description: 'Fix leakage under bathroom sink.',
    timing: { type: 'flexible', day: 'Saturday', timeSlot: 'afternoon' },
    location: { city: 'Beirut', street: 'Corniche', building: 'House 10', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 120, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '32',
    status: 'pending',
    groupId: '',
    category: 'Plumbing',
    title: 'Install water heater',
    description: 'Install new electric water heater.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Main Road', building: 'Block 5', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 200, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Babysitting
  {
    id: '36',
    status: 'pending',
    groupId: 'grp-baby-1',
    category: 'Babysitting',
    title: 'Weekend babysitting',
    description: 'Sitter needed for 2 kids on weekends.',
    timing: { type: 'flexible', day: 'Sunday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Hamra', building: 'House 2', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 150, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '37',
    status: 'pending',
    groupId: '',
    category: 'Babysitting',
    title: 'Evening babysitter',
    description: 'Help with 1 child from 6PM to 10PM.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Main Street', building: 'House 8', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 100, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Beauty
  {
    id: '41',
    status: 'pending',
    groupId: 'grp-pet-1',
    category: 'Beauty',
    title: 'Dog haircut and wash',
    description: 'Haircut and wash for small dog.',
    timing: { type: 'flexible', day: 'Friday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Dog Street', building: 'Pet Salon 1', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 80, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '42',
    status: 'pending',
    groupId: '',
    category: 'Beauty',
    title: 'Cat grooming service',
    description: 'Cat grooming and claw trimming.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Cat Road', building: 'Pet Salon 2', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 70, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Moving
  {
    id: '46',
    status: 'pending',
    groupId: 'grp-move-1',
    category: 'Moving',
    title: 'Move furniture to new apartment',
    description: 'Help moving 2-bedroom apartment.',
    timing: { type: 'flexible', day: 'Saturday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Downtown', building: 'Apartment 2', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 300, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '47',
    status: 'pending',
    groupId: '',
    category: 'Moving',
    title: 'Packing and moving service',
    description: 'Packing boxes and moving to new house.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: { city: 'Tripoli', street: 'Main Street', building: 'Apartment 3', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 400, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Gardening
  {
    id: '51',
    status: 'pending',
    groupId: 'grp-garden-1',
    category: 'Gardening',
    title: 'Trim backyard trees',
    description: 'Trim and clean trees backyard.',
    timing: { type: 'flexible', day: 'Thursday', timeSlot: 'afternoon' },
    location: { city: 'Beirut', street: 'Garden Road', building: 'Villa 1', images: ['https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 120, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '52',
    status: 'pending',
    groupId: '',
    category: 'Gardening',
    title: 'Garden landscaping service',
    description: 'New landscaping project.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: {
      city: 'Tripoli', street: 'Park Street', building: 'Villa 2', images: ['https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=640&q=80' , 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80']
    },
    budget: { hasBudget: true, type: 'fixed', amount: 500, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Beauty
  {
    id: '56',
    status: 'pending',
    groupId: 'grp-nail-1',
    category: 'Beauty',
    title: 'Wedding nails design',
    description: 'Nail art for wedding day.',
    timing: { type: 'flexible', day: 'Wednesday', timeSlot: 'afternoon' },
    location: { city: 'Beirut', street: 'Beauty Road', building: 'Salon 1', images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 100, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '57',
    status: 'pending',
    groupId: '',
    category: 'Beauty',
    title: 'Home manicure and pedicure',
    description: 'Home visit for manicure and pedicure.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: {
      city: 'Tripoli', street: 'Beauty Street', building: 'Home 2', images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=640&q=80']
    },
    budget: { hasBudget: true, type: 'fixed', amount: 80, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Massage
  {
    id: '61',
    status: 'pending',
    groupId: 'grp-spa-1',
    category: 'Massage',
    title: 'Home spa massage service',
    description: 'Home service for massage.',
    timing: { type: 'flexible', day: 'Monday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Wellness Road', building: 'Apartment 1', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 150, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '62',
    status: 'pending',
    groupId: '',
    category: 'Massage',
    title: 'Relaxation package',
    description: 'Full body relaxation session.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: {
      city: 'Tripoli', street: 'Relax Street', building: 'Apartment 2', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80']
    },
    budget: { hasBudget: true, type: 'fixed', amount: 200, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Cleaning
  {
    id: '66',
    status: 'pending',
    groupId: 'grp-clean-1',
    category: 'Cleaning',
    title: 'Full apartment cleaning',
    description: '3-bedroom apartment deep cleaning.',
    timing: { type: 'flexible', day: 'Friday', timeSlot: 'morning' },
    location: { city: 'Beirut', street: 'Main Street', building: 'Apartment 1', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80']},
    budget: { hasBudget: true, type: 'fixed', amount: 150, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '67',
    status: 'pending',
    groupId: '',
    category: 'Cleaning',
    title: 'Post construction cleaning',
    description: 'New house cleaning after renovation.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: {
      city: 'Tripoli', street: 'Construction Road', building: 'Apartment 2', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80']
    },
    budget: { hasBudget: true, type: 'fixed', amount: 300, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // AC & HVAC
  {
    id: '71',
    status: 'pending',
    groupId: 'grp-ac-1',
    category: 'AC & HVAC',
    title: 'AC gas refill',
    description: 'AC not cooling properly, refill gas needed.',
    timing: { type: 'flexible', day: 'Wednesday', timeSlot: 'afternoon' },
    location: { city: 'Beirut', street: 'Cooling St', building: 'House 1', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 100, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '72',
    status: 'pending',
    groupId: '',
    category: 'AC & HVAC',
    title: 'AC unit maintenance',
    description: 'Regular maintenance for 2 units.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: {
      city: 'Tripoli', street: 'Cooling Street', building: 'House 2', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80' , 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80']
    },
    budget: { hasBudget: true, type: 'fixed', amount: 150, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },

  // Beauty
  {
    id: '76',
    status: 'pending',
    groupId: 'grp-makeup-1',
    category: 'Beauty',
    title: 'Wedding makeup booking',
    description: 'Full wedding makeup service.',
    timing: { type: 'flexible', day: 'Tuesday', timeSlot: 'afternoon' },
    location: { city: 'Beirut', street: 'Beauty Ave', building: 'Salon 1', images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=640&q=80'] },
    budget: { hasBudget: true, type: 'fixed', amount: 250, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  },
  {
    id: '77',
    status: 'pending',
    groupId: '',
    category: 'Beauty',
    title: 'Graduation party makeup',
    description: 'Makeup for graduation event.',
    timing: { type: 'urgent', day: '', timeSlot: '' },
    location: {
      city: 'Tripoli', street: 'Party Street', building: 'Salon 2', images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=640&q=80' , 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80']
    },
    budget: { hasBudget: true, type: 'fixed', amount: 180, hourlyRate: 0 },
    providerSelection: { type: 'all', selectedProvider: null }
  }
];
