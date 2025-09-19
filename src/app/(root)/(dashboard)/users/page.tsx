/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getUsers } from '@/services/userService'
import { Search, Plus } from 'lucide-react'

interface UserManagementProps {
    searchParams: Promise<{
        search?: string
        page?: string
        limit?: string
    }>
}

export default async function UserManagement({ searchParams }: UserManagementProps) {
    const params = await searchParams
    const search = params.search || ''
    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '20')

    const usersResponse = await getUsers(search, page, limit)

    if (!usersResponse.success) {
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

    const users = (usersResponse.data as any[]) || []

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">User Management</h1>
                <Button asChild>
                    <Link href="/users/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        method="GET"
                        className="mb-6">
                        <div className="flex gap-4">
                            <Input
                                name="search"
                                placeholder="Search users..."
                                defaultValue={search}
                                className="flex-1"
                            />
                            <Button type="submit">
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                        </div>
                        <input
                            type="hidden"
                            name="page"
                            value="1"
                        />
                        <input
                            type="hidden"
                            name="limit"
                            value={limit}
                        />
                    </form>

                    {/* <UserTable users={users} currentPage={page} limit={limit} search={search} /> */}
                </CardContent>
            </Card>
        </div>
    )
}
