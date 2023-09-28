const { exec } = require("child_process");

const serverIPAddress = "54.165.155.49"; // Replace with your EC2 instance's IP address
const pingCount = 5; // Number of ping requests to send

// Construct the ping command
const pingCommand = `ping -c ${pingCount} ${serverIPAddress}`;

// Execute the ping command
exec(pingCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing ping: ${error.message}`);
    return;
  }

  // Parse the ping results from stdout
  const pingResults = stdout.split("\n");

  // Extract the ping times from the results
  const pingTimes = pingResults
    .filter((line) => line.includes("time="))
    .map((line) => {
      const match = /time=([\d.]+) ms/.exec(line);
      return match ? parseFloat(match[1]) : null;
    });

  // Calculate the average ping time
  const filteredPingTimes = pingTimes.filter((time) => time !== null);
  const averagePingTime =
    filteredPingTimes.reduce((sum, time) => sum + time, 0) /
    filteredPingTimes.length;

  console.log(
    `Average round-trip time to ${serverIPAddress}: ${averagePingTime.toFixed(
      2
    )} ms`
  );
});
