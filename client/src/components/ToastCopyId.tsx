"use client"
import { Copy } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"; // Import Button and its props
import { useToast } from "@/hooks/use-toast";

// Define props interface to extend ButtonProps
interface ToastCopyIdButtonProps extends ButtonProps {
    id: string; // ID to copy
  }
  
  export function ToastCopyIdButton({ id, ...props }: ToastCopyIdButtonProps) {
    const { toast } = useToast();
  
    const handleCopyId = async () => {
        console.log("Button clicked and handleCopyId triggered"); // Check button click
        try {
            // Check for permission before attempting to copy
            const permissionStatus = await navigator.permissions.query({ name: "clipboard-write" as PermissionName });
            if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
              await navigator.clipboard.writeText(id);
              toast({
                description: `ID ${id} has been copied to the clipboard.`,
              });
            } else {
              throw new Error("Clipboard permissions are denied.");
            }
          } catch (error) {
            console.error("Failed to copy ID:", error);
            toast({
              description: "Failed to copy ID. Please check clipboard permissions.",
            });
          }
    };

  return (
    <Button {...props} onClick={handleCopyId}>
        {props.children || <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}
