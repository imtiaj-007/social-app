'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getUsers } from '@/services/userService'
import { Search } from 'lucide-react'
import { Profile } from '@/generated/prisma'
import UserCard from '@/components/UserCard'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export default function UserManagement() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [searchValue, setSearchValue] = useState(search)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const { success, data } = await getUsers(search, page, limit)
                if (success) {
                    setUsers(data as Profile[])
                } else {
                    setError(true)
                }
            } catch (err) {
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [search, page, limit])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set('search', searchValue)
        newParams.set('page', '1')
        router.push(`/users?${newParams.toString()}`)
    }

    const displayToast = (type: 'block' | 'delete') => {
        const message =
            type === 'block'
                ? 'User has been blocked successfully'
                : 'User has been deleted successfully'

        toast.error('Operation Successful', { description: message })
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">Failed to load users. Please try again.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-0">
            <div className="border-b p-4">
                <h4 className="text-center">User Management</h4>
            </div>

            <div className="p-4 space-y-4">
                <form
                    onSubmit={handleSearch}
                    className="mb-6">
                    <div className="flex gap-4">
                        <Input
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            placeholder="Search users..."
                            className="flex-1"
                        />
                        <Button type="submit">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </form>
                {loading && <p>Loading users...</p>}
                {users.map(u => (
                    <UserCard
                        key={u.id}
                        user={u}
                        onBlock={() => displayToast('block')}
                        onDelete={() => displayToast('delete')}
                    />
                ))}
            </div>
        </div>
    )
}
