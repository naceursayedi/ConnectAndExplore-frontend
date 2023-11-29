import { jwtDecode } from "jwt-decode";
import { UserRegistration, userResource, usersResource } from "../Resources";
import Cookies from "js-cookie";
import { fetchWithErrorHandling } from "./validation";



const HOST = process.env.REACT_APP_API_SERVER_URL;

export async function signup(user: UserRegistration): Promise<boolean> {
  const url = `${HOST}/api/users/register`;
  try {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
      name: {
        first: user.name.first,
        last: user.name.last,
      },
      password: user.password,
      address: {
        street: user.address.street,
        houseNumber: user.address.houseNumber,
        postalCode: user.address.postalCode,
        city: user.address.city,
        country: user.address.country,
        stateOrRegion: user.address.stateOrRegion,
        apartmentNumber: user.address.apartmentNumber,
      },
      profilePicture: user.profilePicture,
      birthDate: user.birthDate,
      gender: user.gender,
      socialMediaUrls: {
        facebook: user.socialMediaUrls?.facebook,
        instagram: user.socialMediaUrls?.instagram,
      },
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Signup failed:', result);
    throw new Error(result.message || 'Signup failed');
  }

  return true;
} catch (error) {
  console.error('Error in signup function:', error);
  throw error;
}
}

export async function login(email: string, password: string): Promise<Boolean> {
  const url = `${HOST}/api/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      // Assuming the server returns the JWT in a field named "access_token"
      const accessToken = result.access_token;

      // Set the JWT in the cookies
      Cookies.set("access_token", accessToken);

      return true;
    } else {
      console.error('Login failed:', response);
      return false;
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}


// export async function getUser(userId: string) {
//   const url = `${HOST}/api/users/${userId}`;

//   try {
//     const token = Cookies.get('access_token');

//     if (!token) {
//       console.error('No access token available.');
//       // Handle the absence of the token as needed
//       return null;
//     }

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log('getUser response:', response);

//     if (!response.ok) {
//       console.error('Error fetching user profile:', response);
//       throw new Error('Error fetching user profile');
//     }

//     const userProfile = await response.json();
//     return userProfile;
//   } catch (error) {
//     console.error('Error in getUser function:', error);
//     throw error;
//   }
// }



export function getUserIDFromJWT() {
  try {
    const cookie = Cookies.get("access_token");
    if (cookie) {
      const jwt: any = jwtDecode(cookie);
      console.log("Decoded JWT:", jwt);
      return jwt?.sub || undefined;
    }
  } catch (error) {
    console.error("Error decoding JWT:", error);
  }
  return undefined;
}




export function logout() {
  Cookies.remove("access_token");
}

function headers() {
  const headers:any = {
    "Content-Type":"application/json"
  }
  const jwt = Cookies.get("access_token");
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  return headers;
}

/**
 * 
 * @returns users as usersResource
 */
export async function getAllUsers():Promise<usersResource> {
  const url = `${HOST}/api/users`;
  try {
    const response = await fetchWithErrorHandling(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response as usersResource;
  } catch (err) {
    throw err;
  }
}

export async function getUser(userid:string):Promise<userResource> {
  if (!userid) {
    throw new Error("Userid is invalid.")
  }
  const url = `${HOST}/api/users/${userid}`;
  try {
    const response = await fetchWithErrorHandling(url, {
      method:"GET", 
      headers: headers(),
      });
    return response as userResource;
  } catch(err) {
    throw err;
  }
}

export async function updateUser(user:userResource):Promise<userResource> {
  if (!user.id) {
    throw new Error("Userid is invalid.")
  }
  const url = `${HOST}/api/users/${user.id}`;
  try {
    console.log("userinfo:",user)
    const response = await fetchWithErrorHandling(url, {
      method:"PUT", 
      headers: headers(),
      body:JSON.stringify(user)
      });
    return response as userResource;
  } catch(err) {
    throw err;
  }
}

export async function deleteUser(userid:string):Promise<Boolean> {
  if (!userid) {
    throw new Error("Userid is invalid.")
  }
  const url = `${HOST}/api/users/${userid}`;
  try {
    const response = await fetchWithErrorHandling(url, {
      method:"DELETE", 
      headers: headers(),
      });
    return response as Boolean;
  } catch(err) {
    throw err;
  }
}
