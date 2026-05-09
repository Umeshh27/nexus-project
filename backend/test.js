
/**
 * Test script to verify the registration API endpoint.
 * Useful for checking backend connectivity before frontend integration.
 */
async function test() {
    const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Test User",
            email: "test2@example.com",
            password: "TestPassword123!",
            orgAction: "create",
            orgName: "Test Org"
        })
    });
    const text = await res.text();
    console.log(res.status, text);
}
test();
