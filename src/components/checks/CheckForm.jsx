import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function CheckForm({ onSubmit, defaultValues, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkSchema),
    defaultValues: defaultValues || {
      name: "",
      url: "",
      interval: 5,
      timeout: 30,
      expectedStatusCode: 200,
      webhookUrl: "",
      webhookEnabled: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Name"
        placeholder="My API"
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        label="URL"
        placeholder="https://api.example.com/health"
        error={errors.url?.message}
        {...register("url")}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interval">Check Interval (minutes)</Label>
          <select
            id="interval"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("interval", { valueAsNumber: true })}
          >
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
          {errors.interval && (
            <p className="text-sm text-destructive">
              {errors.interval.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeout">Timeout (seconds)</Label>
          <input
            id="timeout"
            type="number"
            min="5"
            max="60"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("timeout", { valueAsNumber: true })}
          />
          {errors.timeout && (
            <p className="text-sm text-destructive">{errors.timeout.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedStatusCode">Expected Status Code</Label>
        <input
          id="expectedStatusCode"
          type="number"
          min="100"
          max="599"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("expectedStatusCode", { valueAsNumber: true })}
        />
        {errors.expectedStatusCode && (
          <p className="text-sm text-destructive">
            {errors.expectedStatusCode.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="webhookUrl">Webhook URL (optional)</Label>
        <FormField
          id="webhookUrl"
          placeholder="https://hooks.slack.com/..."
          error={errors.webhookUrl?.message}
          {...register("webhookUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Receive notifications when this check goes down or recovers
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="webhookEnabled"
          className="h-4 w-4 rounded border-gray-300"
          {...register("webhookEnabled")}
        />
        <Label
          htmlFor="webhookEnabled"
          className="text-sm font-normal cursor-pointer"
        >
          Enable webhook notifications
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {defaultValues ? "Update Check" : "Create Check"}
      </Button>
    </form>
  );
}
