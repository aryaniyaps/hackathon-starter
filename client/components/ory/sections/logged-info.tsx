import { useTranslations } from "next-intl";
import { SelfServiceFlow } from "../helpers/types";

export interface IdentifierInfoProps {
  flow: SelfServiceFlow;
}

/**
 * LoggedInInfo renders the identifier of the user that is currently logged in.
 * @param flow - Ory Flow object
 */
export const LoggedInInfo = ({ flow }: IdentifierInfoProps) => {
  const t = useTranslations();
  const identifier = flow.ui.nodes.find(
    (i) => "name" in i.attributes && i.attributes.name === "identifier"
  )?.attributes;

  if (!identifier || !("value" in identifier)) return null;

  return (
    <div className="flex flex-col items-center m-4 mb-0 p-2">
      {t("login.logged-in-as-label")}
      <div className="px-2 py-1 font-bold mt-2 text-muted-foreground">
        {identifier.value}
      </div>
    </div>
  );
};
