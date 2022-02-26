import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xb205F6C382301215e1a022ff8d4a90346A583473"
);

(async () => {
  try {
    console.log(
      "👀 Roles that exist right now:",
      await tokenModule.getAllRoleMembers()
    );

    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log("🎉 remaining roles", await tokenModule.getAllRoleMembers());
    console.log(
      "✅ Successfully revoked our superpowers from the ERC-20 contract"
    );
  } catch (e) {
    console.error("Failed to revoke ourselves from the DAO treasury", e);
  }
})();
