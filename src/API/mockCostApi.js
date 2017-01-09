const costs = [
  {
    id: 1,
    course: "6 courses",
    cost: "€65",
    duration: "6 Consecutive Sessions",
    description: "Buy 5 Get 1 Free consecutive Courses.",
    package: "Class Package"
  },
  {
    id: 2,
    course: "1 Week New Students",
    cost: "€25",
    duration: "1 Week",
    description: "News Students Only",
    package: "New Student Offer"
  },
  {
    id: 3,
    course: "1 course",
    cost: "€13",
    duration: "1 Class",
    description: "Drop In limited to space availability.",
    package: "Drop In"
  },
  {
    id: 4,
    course: "1 course",
    cost: "€55",
    duration: "1 class",
    description: "One-on-One Private Session.",
    package: "Private Lessons"
  },
  {
    id: 5,
    course: "1 course",
    cost: "€65",
    duration: "1 class",
    description: "Private sessions for group of 4 or more.",
    package: "Bespoke Yoga"
  },
  {
    id: 6,
    course: "Kids Yoga 4-7",
    cost: "€35",
    duration: "4 Classes",
    description: "Yoga for Kids, ages 4-7 years old.",
    package: "Yoga for Children"
  },
  {
    id: 7,
    course: "Kids Yoga 8-12",
    cost: "€35",
    duration: "4 Classes",
    description: "Yoga for Kids, ages 8-12 years old.",
    package: "Yoga for Children"
  },
  {
    id: 8,
    course: "Teen Yoga 13-19",
    cost: "€45",
    duration: "4 Classes",
    description: "Yoga for Teens.",
    package: "Yoga for Children"
  }
];

class CostApi {
  static getAllItems() {
    return new Promise((resolve, reject) => {
      resolve(Object.assign([], costs));
    });
  }
}

export default CostApi;
