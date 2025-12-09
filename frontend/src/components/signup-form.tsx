import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AiTwotoneCrown } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { useField } from '@/hooks/useField'
import { toast } from 'sonner'
import axios from 'axios'
import { axiosInstance } from '@/utils/axiosSecure'
import { useAuthStore } from '@/stores/authStore'

interface Signup2Props {
  heading?: string
  title?: string
  buttonText?: string
  googleText?: string
  signupText?: string
  signupUrl?: string
}

const Signup2 = ({
  heading = 'Sign up',
  title = 'React Royale',
  buttonText = 'Create Account',
  signupText = 'Already a user?',
}: Signup2Props) => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const username = useField('text')
  const name = useField('text')
  const password = useField('password')
  const confirmPassword = useField('password')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (password.value !== confirmPassword.value) {
      toast.error('Passwords do not match')
      return
    }

    const credentials = {
      username: username.value,
      password: password.value,
    }

    try {
      await axiosInstance.post('/api/users', {
        username: credentials.username,
        name: name.value,
        password: credentials.password,
      })

      await login(credentials)

      username.reset()
      name.reset()
      password.reset()
      confirmPassword.reset()

      toast.success('Welcome to React Royale!')
      navigate('/')
    } catch (error) {
      console.error('Signup failed:', error)
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Signup failed. Please try again.')
      }
    }
  }

  return (
    <section className="bg-white-100 h-screen pb-36">
      <form className="flex h-full items-center justify-center" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <div className="flex items-center gap-4 text-3xl font-bold">
            <AiTwotoneCrown size={48} className="text-yellow-400" /> {title}
          </div>
          <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
            <div className="flex w-full flex-col gap-2">
              <Label>Username</Label>
              <Input
                type={username.type}
                value={username.value}
                onChange={username.onChange}
                placeholder="Username"
                className="text-sm"
                required
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Name</Label>
              <Input
                type={name.type}
                value={name.value}
                onChange={name.onChange}
                placeholder="Full Name"
                className="text-sm"
                required
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Password</Label>
              <Input
                type={password.type}
                value={password.value}
                onChange={password.onChange}
                placeholder="Password"
                className="text-sm"
                required
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Confirm Password</Label>
              <Input
                type={confirmPassword.type}
                value={confirmPassword.value}
                onChange={confirmPassword.onChange}
                placeholder="Confirm Password"
                className="text-sm"
                required
              />
            </div>
            <Button type="submit" className="w-full" data-testid="signup-button">
              {buttonText}
            </Button>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </div>
        </div>
      </form>
    </section>
  )
}

export { Signup2 }
