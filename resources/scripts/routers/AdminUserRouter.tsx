import { httpErrorToHuman } from '@/api/http'
import NavigationBar, { NavigationBarContext } from '@/components/elements/navigation/NavigationBar'
import ScreenBlock, { NotFound, ErrorMessage } from '@/components/elements/ScreenBlock'
import Spinner from '@/components/elements/Spinner'
import routes from '@/routers/router'
import { ServerContext } from '@/state/server'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Outlet, Route, Routes, useMatch } from 'react-router-dom'
import { ArrowPathIcon, ExclamationCircleIcon, NoSymbolIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AdminServerContext } from '@/state/admin/server'
import { AdminBanner } from '@/routers/AdminDashboardRouter'
import FixServerStatusButton from '@/components/admin/servers/FixServerStatusButton'
import { AdminUserContext } from '@/state/admin/user'

const AdminUserRouter = () => {
    const match = useMatch('/admin/users/:id/*')
    const id = match!.params.id
    const [error, setError] = useState<string>()
    const user = AdminUserContext.useStoreState(state => state.user.data)
    const getUser = AdminUserContext.useStoreActions(actions => actions.user.getUser)
    const clearUserState = AdminUserContext.useStoreActions(actions => actions.clearUserState)

    const visibleRoutes = useMemo(
        () => [
            {
                name: 'Settings',
                path: `/admin/users/${id}/settings`,
            },
            {
                name: 'Servers',
                path: `/admin/users/${id}/servers`,
            },
        ],
        [match?.params.id]
    )

    useEffect(() => {
        setError(undefined)

        getUser(parseInt(match!.params.id as string)).catch((error: any) => {

            setError(httpErrorToHuman(error))
        })

        return () => {
            clearUserState()
        }
    }, [match?.params.id])

    const { setRoutes, setBreadcrumb } = useContext(NavigationBarContext)

    useEffect(() => {
        setRoutes(visibleRoutes)

        return () => setBreadcrumb(null)
    }, [])

    useEffect(() => {
        setBreadcrumb(user?.name)
    }, [user])

    return (
        <>
            {!user ? (
                error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <Spinner />
                )
            ) : (
                <Outlet />
            )}
        </>
    )
}

export default AdminUserRouter
