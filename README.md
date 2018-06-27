# dat-auth

This proof of concept illustrates how you can use `dat` as an authentication provider for HTTP services. This example works in [Beaker Browser](https://beakerbrowser.com), but could be ported to other clients too.

## Description

Authentication using `dat-auth` follows these steps:

1. Client prompts for a writeable `dat` to act as user profile
2. Client does a simple GET to `http://service/auth/dat` to receive a token
3. Server generates and returns token to client
4. Server stores token on session
5. Client writes a file with filename $TOKEN to the profile `dat`. This proves the profile is indeed owned by the user.
6. Client POSTs the `dat` public key to `http://service/auth/dat`
7. Server uses the public key to check if the chosen profile `dat` has a file with filename $TOKEN
- If the profile has got the token: `200: Authenticated`
- If the profile does not have the token: `401: Unauthenticated`
8. Client deletes the token file from the profile `dat`

## License

Apache 2.0
