const schedules = [
  {
    id: 1,
    session_date: "Tuesday January 10, 2017",
    href: "http://www.yogamariemills/About/",
    route: "about",
    session_details: [
      {
        id: 1,
        session_time: "10:00 AM - 11:00 AM",
        class: "Hatha Yoga"
      },
      {
        id: 2,
        session_time: "10:00 AM - 11:00 AM",
        class: "Hatha Yoga"
      },
      {
        id: 3,
        session_time: "10:00 AM - 11:00 AM",
        class: "Hatha Yoga"
      },
    ]
  },
  {
    id: 2,
    session_date: "Wednesday January 11, 2017",
    href: "http://www.yogamariemills/About/",
    route: "about",
    session_details: [
      {
        id: 1,
        session_time: "10:00 AM - 11:00 AM",
        class: "Mens Yoga"
      },
      {
        id: 2,
        session_time: "11:00 AM - 12:00 PM",
        class: "Mens Yoga"
      },
      {
        id: 3,
        session_time: "12:00 AM - 1:00 PM",
        class: "Mens Yoga"
      },
    ]
  }
];

class ScheduleApi {
  static getAllItems() {
    return new Promise((resolve, reject) => {
      resolve(Object.assign([], schedules));
    });
  }
}

export default ScheduleApi;
