const categoriesData = [
    { name: "Cleaning", icon: "trash", tags: ["cleaning","home","maid","dust","floor","disinfect","housekeeping"] },
    { name: "Plumbing", icon: "water", tags: ["plumber","pipes","leak","sink","toilet","faucet","bathroom"] },
    { name: "Electrical", icon: "flash", tags: ["electrician","wiring","lights","socket","circuit","repair","install"] },
    { name: "Painting", icon: "color-palette", tags: ["painting","wall","interior","exterior","color","brush","design"] },
    { name: "Renovation", icon: "home", tags: ["renovation","remodel","upgrade","repair","kitchen","bathroom","tiles"] },
    { name: "Roofing", icon: "home", tags: ["roof","leak","tiles","waterproof","insulation","repair","gutter"] },
    { name: "AC & HVAC", icon: "snow", tags: ["ac","hvac","cooling","heating","ventilation","repair","install"] },
    { name: "Fridge & Washer Repair", icon: "settings", tags: ["fridge","gheselle","washingmachine","dryer","freezer","repair","technician"] },
    { name: "Pest Control", icon: "bug", tags: ["pest","cockroach","rat","termites","ants","fumigation","spray"] },
    { name: "Gardening", icon: "leaf", tags: ["gardening","landscape","plants","lawn","pruning","flowers","outdoor"] },
    { name: "Handyman", icon: "construct", tags: ["handyman","fix","smalljobs","maintenance","mount","tools","repair"] },
    { name: "Locksmith", icon: "key", tags: ["locksmith","keys","door","lock","security","replacement","emergency"] },
    { name: "Moving", icon: "cube", tags: ["moving","packing","boxes","transport","relocation","house","shift"] },
    { name: "Barber", icon: "person", tags: ["barber","haircut","fade","shave","trim","style","grooming"] },
    { name: "Beauty", icon: "cut", tags: ["beauty","makeup","nails","salon","style","selfcare","treatment"] },
    { name: "Massage", icon: "leaf", tags: ["massage","therapy","relax","spa","healing","wellness","body"] },
    { name: "Babysitting", icon: "happy", tags: ["babysitting","childcare","kids","nanny","family","home","care"] },
    { name: "Car Mechanic", icon: "car", tags: ["mechanic","engine","garage","service","repair","oilchange","car"] },
    { name: "Car Electrician", icon: "flash", tags: ["car","electrician","battery","wiring","lights","starter","repair"] },
    { name: "Car Wash", icon: "water", tags: ["carwash","detailing","clean","shine","polish","interior","exterior"] },
    { name: "Gas & Stove Repair", icon: "flame", tags: ["gas","stove","oven","burner","cooker","repair","leak"] },    
    { name: "Tyre & Battery", icon: "disc", tags: ["tyre","tire","battery","replacement","car","repair","auto"] },
    {name: "Catering Services", icon: "restaurant", tags: ["catering","food","chef","buffet","party","event","meal"]}
];
  
  // Convert to UI format
  export const categories = categoriesData.map((category, index) => ({
    id: (index + 1).toString(),
    title: category.name,
    iconName: category.icon + "-outline"
  }));
  
  export const categoriesWithTags = categoriesData;

  // Centralized category mapping function for translations
  export const getCategoryTranslation = (categoryTitle, tCategories) => {
    const categoryMap = {
      'Cleaning': tCategories('cleaning'),
      'Plumbing': tCategories('plumbing'),
      'Electrical': tCategories('electrical'),
      'Painting': tCategories('painting'),
      'Renovation': tCategories('renovation'),
      'Roofing': tCategories('roofing'),
      'AC & HVAC': tCategories('acHvac'),
      'Fridge & Washer Repair': tCategories('fridgeWasherRepair'),
      'Pest Control': tCategories('pestControl'),
      'Gardening': tCategories('gardening'),
      'Handyman': tCategories('handyman'),
      'Locksmith': tCategories('locksmith'),
      'Moving': tCategories('moving'),
      'Barber': tCategories('barber'),
      'Beauty': tCategories('beauty'),
      'Massage': tCategories('massage'),
      'Babysitting': tCategories('babysitting'),
      'Car Mechanic': tCategories('carMechanic'),
      'Car Electrician': tCategories('carElectrician'),
      'Car Wash': tCategories('carWash'),
      'Gas & Stove Repair': tCategories('gasStoveRepair'),
      'Tyre & Battery': tCategories('tyreBattery'),
      'Catering Services': tCategories('cateringServices'),
      'Other': tCategories('other'),
    };
    return categoryMap[categoryTitle] || categoryTitle;
  };
  