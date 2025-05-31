import type { AuthStateTypes } from "./AuthStateTypes";
import type { SnackBarStateTypes } from "./SnackBarStateTypes";

export interface AppStateTypes {
   snackBar: SnackBarStateTypes;
   auth: AuthStateTypes;
}
