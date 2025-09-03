/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function CourseThumbnailUpload({
  previewUrl,
  register,
  error,
}: {
  previewUrl: string | null;
  register: any;
  error?: string;
}) {
  return (
    <div>
      <label className="label">Course Thumbnail *</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg hover:border-gray-400">
        <div className="space-y-2 text-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="mx-auto h-32 w-48 object-cover rounded-lg"
            />
          ) : (
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}

          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer text-blue-600 hover:text-blue-500">
              <span>Upload a file</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                {...register("thumbnail", {
                  required: "Thumbnail is required",
                })}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
