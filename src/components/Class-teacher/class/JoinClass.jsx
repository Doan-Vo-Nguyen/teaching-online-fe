import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useAuthToken from "@/hooks/userAuthToken";
import { joinClass } from "@/api/userApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { triggerClassUpdate } from "@/store/classSlice";

const passwordSchema = z
  .object({
    class_code: z.string().min(1, "Mã lớp học không được để trống"),
  });

const JoinClass = ({ open, onOpenChange,fetchJoinedClasses, fetchJoinedClassDetails }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuthToken();
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      class_code: "",
    },
  });
  const onSubmit = async (values) => {
    const { class_code } = values;
    setIsLoading(true);
    try {
      const res = await joinClass(auth.id, class_code);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (res.success) {
        onOpenChange(false);
          dispatch(triggerClassUpdate());
        await fetchJoinedClasses();
       await fetchJoinedClassDetails();
        form.reset();
        toast.success(res.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details ||
        error.response?.data?.error?.message;
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tham gia lớp học</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="class_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã lớp học</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end space-x-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                <X size={16} className="mr-2" />
                Hủy
              </Button>
              <Button variant="info" type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    Xác nhận
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinClass;
