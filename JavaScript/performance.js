if (typeof PerformanceObserver !== "undefined") {
  //if browser is supporting
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry, "----");
      console.log(entry.entryType);
      console.log(entry.startTime);
      console.log(entry.duration);
    }
  });
  observer.observe({ entryTypes: ["paint"] });
}
