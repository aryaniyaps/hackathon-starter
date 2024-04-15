"use client";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";

export default function SearchBar() {
  const t = useTranslations("dashboard.search-bar");
  return <Input placeholder={t("placeholder")} />;
}
