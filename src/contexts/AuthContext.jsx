// src/contexts/AuthContext.jsx
import { createContext, useReducer } from 'react';

// 1. Trạng thái ban đầu (Khởi tạo từ localStorage để không bị mất đăng nhập khi F5)
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token')
};

// 2. Reducer: Hàm chứa các logic xử lý trạng thái
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // Lưu vào localStorage ngay tại đây để tập trung logic
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true
      };
      
    case 'LOGOUT':
      // Xóa dữ liệu khi đăng xuất
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false
      };
      
    default:
      return state;
  }
};

// 3. Khởi tạo Context
export const AuthContext = createContext();

// 4. Component Provider bọc bên ngoài ứng dụng
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};