import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useEffect, useState } from 'react';
const Blog = () => {
  const [allblogs, setAllblogs] = useState([])
  const [selectedBlog, setSelectedBlog] = useState(null)
  const API_URL = import.meta.env.VITE_NODE_ENV === "development" ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_LOCAL_URL
  const schema = z.object({
    title: z.string().min(3),
    desc: z.string().min(3, 'Minimum 3 characters'),
    hero: z.string().min(3, 'Minimum 3 characters').url(),
  });

  const { handleSubmit, register, reset, formState: { errors, touchedFields } } = useForm({
    resolver: zodResolver(schema)
  });

  const handleFormSubmit = (blogData) => {
    try {
      console.log(blogData);
      if (selectedBlog) {
        updateBlog(selectedBlog._id, blogData)
        reset({ title: "", desc: "", hero: "" })
        selectedBlog(null)
      } else {

        createBlog(blogData)
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClasses = (key) => clsx({
    'form-control my-2': true,
    'is-invalid': errors[key],
    'is-valid': touchedFields[key] && !errors[key],
  });
  const createBlog = async (blogData) => {
    try {
      await axios.post(`${API_URL}/create`, blogData)
      toast.success("blog create success")
      readBlog()
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong")
    }
  }

  const readBlog = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/blog`)
      console.log(data);
      setAllblogs(data.result)
      // toast.success("blog read success")
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong")
    }
  }
  const updateBlog = async (id, blogData) => {
    try {
      await axios.put(`${API_URL}/modify/${id}`, blogData)

      toast.success("blog update success")
      readBlog()
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong")
    }
  }
  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${API_URL}/remove/${id}`)

      toast.success("blog delete success")
      readBlog()
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong")
    }
  }
  useEffect(() => {
    readBlog()
  }, [])
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="card">
            <div className="card-header">Blog crud</div>
            <div className="card-body">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div>
                  <label htmlFor="email" className="form-label">title</label>
                  <input
                    type="text"
                    {...register('title')}
                    className={handleClasses('title')}
                    id="title"
                    placeholder="Enter Your title"
                  />
                  <div className="invalid-feedback">{errors.title?.message}</div>
                </div>

                <div className="mt-2">
                  <label htmlFor="desc" className="form-label">desc</label>
                  <input
                    type="desc"
                    {...register('desc')}
                    className={handleClasses('desc')}
                    id="desc"
                    placeholder="Enter Your desc"
                  />
                  <div className="invalid-feedback">{errors.desc?.message}</div>
                </div>
                <div className="mt-2">
                  <label htmlFor="hero" className="form-label">hero</label>
                  <input
                    type="hero"
                    {...register('hero')}
                    className={handleClasses('hero')}
                    id="hero"
                    placeholder="Enter Your hero"
                  />
                  <div className="invalid-feedback">{errors.hero?.message}</div>
                </div>
                {
                  selectedBlog
                    ?
                    <div>
                      <button type="submit" className="btn btn-warning w-100 mt-3">
                        update Blog
                      </button>
                      <button onClick={() => {
                        reset({ title: "", desc: "", hero: "" })
                        setSelectedBlog(null)
                      }} type="button" className="btn btn-outline-secondary w-100 mt-3">
                        <i class="bi bi-x-square"></i>
                      </button>
                    </div>
                    :
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                      Create Blog
                    </button>

                }
              </form>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {
        allblogs && <table class="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>id</th>
              <th>title</th>
              <th>desc</th>
              <th>hero</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {
              allblogs.map(item => <tr>
                <td>{item._id}</td>
                <td>{item.title}</td>
                <td>{item.desc}</td>
                <td>

                  <img src={item.hero} height={100} alt="" />

                </td>
                <td>

                  <button onClick={() => {
                    reset(item)
                    setSelectedBlog(item)
                  }} type="button" class="btn btn-primary">edit</button>
                  <button onClick={() => deleteBlog(item._id)} type="button" class="btn btn-warning">delete</button>

                </td>
              </tr>)
            }

          </tbody>
        </table>
      }
    </div>
  );
};

export default Blog;