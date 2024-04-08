import { UiNode } from "@ory/client";
import { JSX } from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasPassword } from "../helpers/utils";

export interface LoginSectionProps {
  nodes: UiNode[];
  forgotPasswordURL?: string;
}

export const LoginSection = ({
  nodes,
  forgotPasswordURL,
}: LoginSectionProps): JSX.Element | null => {
  const t = useTranslations();
  return hasPassword(nodes) ? (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["default", "password"],
            excludeAttributes: ["submit", "hidden"],
          }}
        />
        {forgotPasswordURL && (
          <Link href={forgotPasswordURL}>
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
