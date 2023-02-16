import { atom } from "recoil";

// an interface that defines the 3 different views of the AuthModal
export interface AuthModalState {
	open: boolean;
	view: "login" | "signup" | "resetPassword";
}

// the default view is closed, if changed to open it is the login view
const defaultModalState: AuthModalState = {
	open: false,
	view: "login",
};

// the modal state atom to be used as a global state elsewhere in the app
export const authModalState = atom<AuthModalState>({
	key: "authModalState",
	default: defaultModalState,
});
