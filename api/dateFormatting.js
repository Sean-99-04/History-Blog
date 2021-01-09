const day1 = new Date();

const weekDay = (day) => {
  const weekDays = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  return weekDays[day.getDay()];
};

const monthDay = (day) => {
  day = day.getDate().toString();
  if (day.match(/^1\d$/)) {
    day = `${day}th`;
    return day;
    // Next one returns anything that starts with any number and ends in 1, or just the number 1
  } else if (day.match(/(^\d([4-9]|0)$)|[4-9]/)) {
    day = `${day}th`;
    return day;
    // Next one returns anything that starts with any number and ends in 1, or just the number 1
  } else if (day.match(/(^\d1$)|1/)) {
    day = `${day}st`;
    return day;
    // Next one returns anything that starts with any number and ends in 2, or just the number 2
  } else if (day.match(/(^\d2$)|2/)) {
    day = `${day}nd`;
    return day;
    // Next one returns anything that starts with any number and ends in 3, or just the number 3
  } else if (day.match(/(^\d3$)|3/)) {
    day = `${day}rd`;
    return day;
  } else
    console.log(
      `There was an error with date formatting api in the monthDay method. Here is the day: ${day}`
    );
};

const month = (month) => {
  const monthObj = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  return monthObj[month.getMonth()];
};

const addZero = (time) => {
  if (time < 10) {
    time = `0${time.toString()}`;
  }
  return time;
};

const minutes = (minutes) => {
  minutes = minutes.getMinutes();
  const min = addZero(minutes);
  return min;
};

const hours = (hours) => {
  hours = hours.getHours();
  const h = addZero(hours);
  return h;
};

const formatDate = (date) => {
  return `${weekDay(date)}, ${monthDay(date)} ${month(
    date
  )}, ${date.getFullYear()} at ${hours(date)}:${minutes(date)}`;
};

module.exports = formatDate;
