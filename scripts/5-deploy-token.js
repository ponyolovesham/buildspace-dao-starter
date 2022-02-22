import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0x48A4d4B1EE2560705ee273f18EcBBbD115F1adF4");

(async () => {
  try {
    const tokenModule = await app.deployTokenModule({
      name: "goguma governance token",
      symbol: "GOGUMA",
    });
    console.log(
      "✅ Successfully deployed token module, address: ",
      tokenModule.address
    );
  } catch (error) {
    console.log("failed to deploy token module", error);
  }
})();
