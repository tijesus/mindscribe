import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/monokai.css'; 
import hljs from 'highlight.js'; 
import axios from 'axios';
import endpoints from '../../api/endPoints'; 
import './CreatePost.css'; 

// Initialize Highlight.js for Quill
hljs.configure({
  languages: ['javascript', 'python', 'html', 'css'], 
});

// Font whitelist for the toolbar (common fonts on user systems)
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['serif', 'sans-serif', 'monospace', 'courier', 'arial', 'times-new-roman', 'georgia']; // Whitelist fonts
ReactQuill.Quill.register(Font, true);

const modules = {
  toolbar: {
    container: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  },
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value, // Syntax highlighting
  },
};

const formats = [
  'header', 'font', 'align', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'blockquote', 'code-block', 'list', 'bullet',
  'link', 'image',
];

const CreatePost = ({ user, seriesId, bannerUrl }) => { // Expect seriesId and bannerUrl as props
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const quillRef = useRef(null); // Ref for ReactQuill

  // Image upload handler with 5MB limit
  const imageHandler = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];

      // Check if file exists and is below 5MB
      if (file && file.size <= 5 * 1024 * 1024) { // 5MB size limit
        try {
          const formData = new FormData();
          formData.append('file', file);

          // Send the image to the server
          const response = await axios.post(`${endpoints.CREATE}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const imageUrl = response.data.fileUrl;
          // Insert image into the editor
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          if (range) {
            quill?.insertEmbed(range.index, 'image', imageUrl);
          }
        } catch (error) {
          console.error('Image upload failed:', error);
          setError('Failed to upload image.');
        }
      } else {
        setError('Image size exceeds 5MB.');
      }
    };
  }, []);

  // Set the custom image handler in Quill after mount
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, [imageHandler]);

  // Form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.username) {
      console.error('User is not logged in or user data is not available.');
      return;
    }

    // Create the new post object using the specified schema format
    const newPost = {
      title,
      content,
      published: true, // This can be dynamic if needed
      readTime: Math.ceil(content.split(' ').length / 200), // Approximate read time based on average reading speed
      bannerUrl: bannerUrl || 'https://mindsrcibe.s3.amazonaws.com/defaultBanner.jpg', // Use passed banner URL or a default
      seriesId: seriesId || '123e4567-e89b-12d3-a456-426614174000', // Use passed series ID or a default
      id: Date.now().toString(), // Generate a unique ID based on timestamp
      createdAt: new Date().toISOString(), // Set creation date
      updatedAt: new Date().toISOString(), // Set updated date
    };

    try {
      const response = await axios.post(`${endpoints.CREATE}`, newPost);
      console.log('Post created successfully:', response.data);
      
      // Clear the form after successful post creation
      setTitle('');
      setContent('');
      setError(''); 
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  // Highlight code after content change
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.ql-syntax');
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block); 
    });
  }, [content]);

  return (
    <div className="create-post-page">
      <h1>Create a New Post</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Write your post content..."
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;