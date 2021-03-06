import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export class DescriptionHelper {
  static renderDescription(time, name, position, passes, showPassName) {
    let description = `
      <div class="ib">
        <h3>Position</h3>
        <table class="ibt">
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Elevation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${name}</td>
              <td>${position.latitude.toFixed(2)}&deg</td>
              <td>${position.longitude.toFixed(2)}&deg</td>
              <td>${(position.height / 1000).toFixed(2)} km</td>
            </tr>
          </tbody>
        </table>
        ${this.renderPasses(passes, time, showPassName)}
      </div>
    `;
    return description;
  }

  static renderPasses(passes, time, showPassName) {
    if (passes.length == 0) {
      return "";
    }

    const start = dayjs(time);
    const upcomingPassIdx = passes.findIndex(pass => {
      return dayjs(pass.end).isAfter(start);
    });
    if (upcomingPassIdx < 0) {
      return "";
    }
    const upcomingPasses = passes.slice(upcomingPassIdx);

    const htmlName = showPassName ? "<th>Name</th>\n" : "";
    const html = `
      <h3>Passes</h3>
      <table class="ibt">
        <thead>
          <tr>
            ${htmlName}
            <th>Countdown</th>
            <th>Start</th>
            <th>End</th>
            <th>El</th>
            <th>Az</th>
          </tr>
        </thead>
        <tbody>
          ${upcomingPasses.map(pass => this.renderPass(start, pass, showPassName)).join("")}
        </tbody>
      </table>
    `;
    return html;
  }

  static renderPass(time, pass, showPassName) {
    function pad2(num) {
      return String(num).padStart(2, "0");
    }
    let timeUntil = "ONGOING";
    if (dayjs(pass.start).diff(time) > 0) {
      timeUntil = `${pad2(dayjs(pass.start).diff(time, "days"))}:${pad2(dayjs(pass.start).diff(time, "hours")%24)}:${pad2(dayjs(pass.start).diff(time, "minutes")%60)}:${pad2(dayjs(pass.start).diff(time, "seconds")%60)}`;
    }
    const htmlName = showPassName ? `<td>${pass.name}</td>\n` : "";
    const html = `
      <tr>
        ${htmlName}
        <td>${timeUntil}</td>
        <td>${dayjs(pass.start).format("DD.MM HH:mm:ss")}</td>
        <td>${dayjs(pass.end).format("HH:mm:ss")}</td>
        <td class="ibt-right">${pass.maxElevation.toFixed(0)}&deg</td>
        <td class="ibt-right">${pass.minAzimuth.toFixed(2)}&deg</td>
      </tr>
    `;
    return html;
  }
}
