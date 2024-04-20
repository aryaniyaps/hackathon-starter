import { UiNode } from "@ory/kratos-client";
import { JSX } from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasPassword } from "../helpers/utils";

export interface LoginSectionProps {
  nodes: UiNode[];
  recoveryURL?: string;
}

export const LoginSection = ({
  nodes,
  recoveryURL,
}: LoginSectionProps): JSX.Element | null => {
  const t = useTranslations();
  return hasPassword(nodes) ? (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["default", "password"],
            excludeAttributes: ["submit", "hidden"],
          }}
        />
        {recoveryURL && (
          <Link href={recoveryURL}>
            <Button data-testid="forgot-password-link" variant="link">
              {t("login.forgot-password")}
            </Button>
          </Link>
        )}
      </div>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["password"],
          attributes: "submit",
        }}
      />
    </div>
  ) : null;
};
