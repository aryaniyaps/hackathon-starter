import useLogout from "@/lib/hooks/useLogout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const logoutSchema = z.object({
  rememberSession: z.boolean(),
});

export default function LogoutDialog() {
  const logout = useLogout();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(logoutSchema),
    defaultValues: { rememberSession: true },
  });

  const onSubmit: SubmitHandler<z.infer<typeof logoutSchema>> = async (
    input
  ) => {
    const data = await logout.mutateAsync({
      rememberSession: input.rememberSession,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex gap-2 w-full justify-start items-center bg-transparent text-left text-foreground hover:text-destructive-foreground"
        >
          <Icons.logOut className="w-4 h-4" /> <p>Logout</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-start gap-4"
          >
            <FormField
              control={form.control}
              name="rememberSession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <div className="flex gap-4">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="remember-session"
                      />{" "}
                      <label
                        htmlFor="remember-session"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember session
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex w-full items-end gap-4">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" type="submit">
                Logout
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
