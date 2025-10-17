import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/node";

async function testFHEVMMethods() {
    console.log("🔍 Testing FHEVM instance methods...");
    
    try {
        const fhevmInstance = await createInstance({
            ...SepoliaConfig,
            url: "https://relayer.testnet.zama.cloud",
            rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ",
            chainId: 11155111
        });
        
        console.log("✅ FHEVM instance created");
        console.log("📋 Available methods:");
        console.log(Object.getOwnPropertyNames(fhevmInstance));
        console.log("📋 Available methods (including prototype):");
        console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(fhevmInstance)));
        
        // Check if there are any deployment-related methods
        const methods = Object.getOwnPropertyNames(fhevmInstance);
        const deploymentMethods = methods.filter(method => 
            method.toLowerCase().includes('deploy') || 
            method.toLowerCase().includes('contract') ||
            method.toLowerCase().includes('compile')
        );
        
        console.log("🚀 Deployment-related methods:", deploymentMethods);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

testFHEVMMethods();
