import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, googleProvider, facebookProvider } from "../../firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
import {API_URL} from "../../config/api.js"

// Helper: enviar datos al backend
const sendToBackend = async (user) => {
  const body = {
    id: user.uid,
    email: user.email,
    nombre: user.displayName,
    foto: user.photoURL || "",
  };

  const res = await fetch(`${API_URL}/api/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Error al logear");
  return data.user;
};

// ✅ Login con Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fullUser = await sendToBackend(result.user);
      return fullUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Login con Facebook
export const loginWithFacebook = createAsyncThunk(
  "auth/loginWithFacebook",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const fullUser = await sendToBackend(result.user);
      return fullUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    succes: false,
    user: null,
    loading: { facebook: false, google: false },
    error: null,
  },
  reducers: {
    updateUser(state, action){
      state.user = {
        ...state.user,
        ...action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = { ...state.loading, google: true };
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = { ...state.loading, google: false };
        state.user = action.payload;
        state.succes = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = { ...state.loading, google: false };
        state.error = action.payload;
      })
      // Facebook
      .addCase(loginWithFacebook.pending, (state) => {
        state.loading = { ...state.loading, facebook: true };
        state.error = null;
      })
      .addCase(loginWithFacebook.fulfilled, (state, action) => {
        state.loading = { ...state.loading, facebook: false };
        state.user = action.payload;
        state.succes = true;
      })
      .addCase(loginWithFacebook.rejected, (state, action) => {
        state.loading = { ...state.loading, facebook: false };
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.succes = false;
      });
  },
});

export const { updateUser } = authSlice.actions
export default authSlice.reducer;
