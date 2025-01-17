import { useField } from 'formik'
import { ServerContext } from '@/state/server'
import useTemplateGroupsSWR from '@/api/server/settings/useTemplateGroupsSWR'
import { useMemo, useState } from 'react'
import Select from '@/components/elements/inputs/Select'
import SelectFormik from '@/components/elements/formik/SelectFormik'
import { useFormContext } from 'react-hook-form'
import SelectForm from '@/components/elements/forms/SelectForm'

interface Props {
    disabled?: boolean
}

const TemplatesSelectForm = ({ disabled }: Props) => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid)
    const { setValue } = useFormContext()
    const { data, mutate, isValidating, isLoading } = useTemplateGroupsSWR(uuid)
    const templateGroups = useMemo(
        () =>
            data?.map(group => {
                return {
                    value: group.uuid,
                    label: group.name,
                    templates: group.templates!.map(template => ({
                        value: template.uuid,
                        label: template.name,
                    })),
                }
            }) ?? [],
        [data]
    )
    const [groupUuid, setGroupUuid] = useState('')
    const templates = useMemo(
        () => templateGroups.find(group => group.value === groupUuid)?.templates ?? [],
        [templateGroups, groupUuid]
    )
    const handleGroupsOnChange = (uuid: string | null) => {
        setGroupUuid(uuid ?? '')
        setValue('templateUuid', '')
    }

    return (
        <>
            <Select
                label={'Template Group'}
                data={templateGroups}
                searchable
                value={groupUuid}
                onChange={handleGroupsOnChange}
                loading={isValidating || isLoading}
                nothingFound={'No groups found'}
                disabled={disabled}
            />
            <SelectForm
                data={templates}
                name={'templateUuid'}
                label={'Template'}
                searchable
                nothingFound={'No templates found'}
                disabled={groupUuid === '' || disabled}
            />
        </>
    )
}

export default TemplatesSelectForm
