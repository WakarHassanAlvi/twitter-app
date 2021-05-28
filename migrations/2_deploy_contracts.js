const Tweetsomething = artifacts.require("Tweetsomething");

module.exports = function (deployer) {
  deployer.deploy(Tweetsomething);
};
