// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/kratos-client";
import { UserSettingsFlowType } from "../user-settings-card";

export const hasGroup = (group: string) => (nodes: UiNode[]) =>
  nodes.some(({ type, group: g }) => type === "input" && g === group);

export const hasOidc = hasGroup("oidc");
export const hasPassword = hasGroup("password");
export const hasProfile = hasGroup("profile");
export const hasWebauthn = hasGroup("webauthn");
export const hasPasskey = hasGroup("passkey");
export const hasLookupSecret = hasGroup("lookup_secret");
export const hasTotp = hasGroup("totp");
export const hasCode = hasGroup("code");

export const hasHiddenIdentifier = (nodes: UiNode[]) =>
  nodes.some(
    ({ attributes }) =>
      "name" in attributes &&
      attributes.name === "identifier" &&
      attributes.type === "hidden"
  );

export const hasFlowType = (
  nodes: UiNode[],
  flowType: UserSettingsFlowType
) => {
  switch (flowType) {
    case "profile":
      return true;
    case "password":
      return hasPassword(nodes);
    case "webauthn":
      return hasWebauthn(nodes);
    case "passkey":
      return hasPasskey(nodes);
    case "lookup_secret":
      return hasLookupSecret(nodes);
    case "oidc":
      return hasOidc(nodes);
    case "totp":
      return hasTotp(nodes);
    default:
      return false;
  }
};
