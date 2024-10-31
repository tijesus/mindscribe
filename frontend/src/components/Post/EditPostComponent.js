import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/monokai.css";
import hljs from "highlight.js";
import endpoints from "../../api/endPoints";
import "./CreatePost.css";

// Reuse the same Quill configuration from CreatePost
const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import("blots/block/embed");

class ImageBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("contenteditable", false);
    node.setAttribute("src", value.url);
    node.setAttribute("alt", value.alt || "");
    node.setAttribute("class", "inserted-image");
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("src"),
      alt: node.getAttribute("alt"),
    };
  }
}
ImageBlot.blotName = "customImage";
ImageBlot.tagName = "img";
Quill.register(ImageBlot);

// Reuse the same modules and formats configuration
const modules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  },
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
};

const formats = [
  "header",
  "font",
  "align",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
  "image",
  "customImage",
];

const EditPost = ({ user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(null);
  const [currentBannerUrl, setCurrentBannerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://mindscribe.praiseafk.tech/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const post = await response.json();
        setTitle(post.title);
        setContent(post.content);
        setCurrentBannerUrl(post.bannerUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to fetch post data");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            `${endpoints.POSTS_ENDPOINTS.UPLOAD_MEDIA}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const imageUrl = data.url;
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);

          if (range.index > 0) {
            quill.insertText(range.index, "\n");
          }

          quill.insertEmbed(range.index, "customImage", {
            url: imageUrl,
            alt: file.name,
          });

          quill.insertText(range.index + 1, "\n");
          quill.setSelection(range.index + 2, 0);
        } catch (error) {
          console.error("Image upload failed:", error);
          setError("Failed to upload image. Please try again.");
        }
      } else {
        setError("Image size exceeds 5MB limit.");
      }
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const toolbar = quill.getModule("toolbar");
      toolbar.addHandler("image", imageHandler);
    }
  }, [imageHandler]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setBanner(file);
      setCurrentBannerUrl(URL.createObjectURL(file));
      setError("");
    } else if (file) {
      setError("Banner size must be 5MB or less.");
      setBanner(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.username) {
      console.error("User is not logged in or user data is not available.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("readTime", Math.ceil(content.split(" ").length / 200));
    if (banner) {
      formData.append("banner", banner);
    }

    try {
      const response = await fetch(
        ` https://mindscribe.praiseafk.tech/posts/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Failed to update post. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="create-post-page">
      <h1>Edit Post</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Banner Image (optional, max 5MB):</label>
        {currentBannerUrl && (
          <div className="current-banner">
            <img
              src={currentBannerUrl}
              alt="Current banner"
              className="banner-preview"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="banner-input"
        />

        <label>Post Title:</label>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Post Content:</label>
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Write your post content..."
        />

        <button type="submit" className="submit-post">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
