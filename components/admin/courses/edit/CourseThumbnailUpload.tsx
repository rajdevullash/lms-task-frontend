/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function CourseThumbnailUpload({
  previewUrl,
  register,
  file,
}: any) {
  const localPreview = file?.[0] ? URL.createObjectURL(file[0]) : null;

  return (
    <div>
      <label className="label">Course Thumbnail</label>
      {previewUrl && !localPreview && (
        <img
          src={previewUrl}
          alt="Current thumbnail"
          className="h-32 w-48 object-cover mb-2 rounded-lg"
        />
      )}
      {localPreview && (
        <img
          src={localPreview}
          alt="New thumbnail"
          className="h-32 w-48 object-cover mb-2 rounded-lg"
        />
      )}
      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <label className="cursor-pointer text-blue-600">
            Upload new thumbnail
            <input
              type="file"
              accept="image/*"
              {...register("thumbnail")}
              className="sr-only"
            />
          </label>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
