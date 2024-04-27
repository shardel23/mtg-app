import { createContext, useContext } from "react";

type UserConfigContextType = {
  show17LandsSection: boolean;
};

const userConfigDefaultValues: UserConfigContextType = {
  show17LandsSection: false,
};

const UserConfigContext = createContext<UserConfigContextType>(
  userConfigDefaultValues,
);

export function useUserConfigContext() {
  return useContext(UserConfigContext);
}

type UserConfigProviderProps = {
  children: React.ReactNode;
  userConfig: UserConfigContextType | null;
};

export function UserConfigProvider({
  children,
  userConfig,
}: UserConfigProviderProps) {
  const values = {
    show17LandsSection:
      userConfig?.show17LandsSection ??
      userConfigDefaultValues.show17LandsSection,
  };

  return (
    <UserConfigContext.Provider value={values}>
      {children}
    </UserConfigContext.Provider>
  );
}
