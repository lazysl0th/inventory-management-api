export type TRoleName = "Admin" | "User";

export default class Role {
  constructor(readonly name: TRoleName) {}

  public isAdmin(): boolean {
    return this.name === "Admin";
  }

  public equals(role: Role): boolean {
    return this.name === role.name;
  }
}
