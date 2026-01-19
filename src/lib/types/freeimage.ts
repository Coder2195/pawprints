export interface FreeImageResponse {
  status_code: number;
  success: {
    message: string;
    code: number;
  };
  image: ImageResult;
  status_txt: string;
}

export interface ImageResult {
  name: string;
  extension: string;
  width: number;
  height: number;
  size: number;
  time: number;
  expiration: number;
  likes: number;
  description: string | null;
  original_filename: string;
  is_animated: number;
  id_encoded: string;
  extension_name: string;
  size_formatted: string;
  filename: string;
  url: string;
  url_short: string;
  url_seo: string;
  url_viewer: string;
  url_viewer_preview: string;
  url_viewer_thumb: string;
  image: ImageType;
  thumb: ImageType;
  medium: ImageType;
  display_url: string;
  display_width: number;
  display_height: number;
  views_label: string;
  likes_label: string;
  how_long_ago: string;
  date_fixed_peer: string;
  title: string;
  title_truncated: string;
  title_truncated_html: string;
  is_use_loader: boolean;
}

export interface ImageType {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
  size?: number;
}
