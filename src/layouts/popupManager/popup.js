import Loading from 'components/Loading'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCookie } from 'react-use-cookie'
import { adminActions } from 'store/admin/admin-slice'
import { useEditPopupMutation } from 'store/api'
import { useGetPopupQuery } from 'store/api'

function PopupManager() {

    const token = getCookie('auth-token')

    const dispatch = useDispatch()
    const refetchpopup = useSelector((state) => state.admin.refetch)
    const { data: popupData, refetch, isLoading } = useGetPopupQuery();
    const [editPopup, { isLoading: editPopupLoading }] = useEditPopupMutation()

    const [formValues, setFormValues] = useState({
        popupImage: null,
        headerEnglish: "",
        headerTurkish: "",
        text: [{
            englishTranslation: "",
            turkishTranslation: ""
        }]

    })

    useEffect(() => {
        if (popupData?.popup) {
            refetch()
            setFormValues(value => {
                return {
                    ...value,
                    headerEnglish: popupData.popup.headerEnglish,
                    headerTurkish: popupData.popup.headerTurkish,
                    text: popupData.popup.text
                }
            });
        }
    }, [popupData, refetchpopup, refetch]);

    const handleTextChange = (index, field, value) => {
        setFormValues((prevValues) => {
            const newText = [...prevValues.text];
            newText[index] = {
                ...newText[index],
                [field]: value,
            };
            return { ...prevValues, text: newText };
        });
    };

    const addTextItem = () => {
        setFormValues((prevValues) => ({
            ...prevValues,
            text: [
                ...prevValues.text,
                {
                    englishTranslation: "",
                    turkishTranslation: "",
                },
            ],
        }));
    };

    const removeTextItem = (index) => {
        setFormValues((prevValues) => {
            const newText = [...prevValues.text];
            newText.splice(index, 1);
            return { ...prevValues, text: newText };
        });
    };



    const submitChanges = async () => {
        try {

            const formData = new FormData();

            formData.append('headerEnglish', formValues.headerEnglish);
            formData.append('headerTurkish', formValues.headerTurkish);
            if (formValues.popupImage instanceof File) {
                formData.append('popupImage', formValues.popupImage);
            }
            formData.append("text", JSON.stringify(formValues.text))



            let result = await editPopup({ formData, token }).unwrap();
            console.log(result);
            if (result?.success) {
                dispatch(adminActions.setRefetch("EDIT"))
                setTimeout(() => {
                    dispatch(adminActions.setRefetch(''));
                }, 1000);
            }
            toast.success(result?.message)
        } catch (error) {
            dispatch(adminActions.setRefetch(""))
            if (Array.isArray(error.data?.message)) {
                error.data?.message.map(el => toast.warn(el))
            } else {
                toast.warn(error.data?.message)
            }
        }
    }

    return (
        <>
            {isLoading || editPopupLoading ? <Loading /> :
                <DashboardLayout>
                    <DashboardNavbar />
                    {popupData?.popup ? <MDBox className="popupSection" >
                        <MDBox className="popupImage" >
                            <img src={formValues.popupImage ? URL.createObjectURL(formValues.popupImage) : `${popupData?.popup.popupImage}`} alt='popup' />
                            <MDBox m={4} mb={2}>
                                <MDTypography mb={1} component="p" variant="caption" color="text" fontWeight="medium">
                                    Upload new popup image
                                </MDTypography>
                                <MDInput
                                    name="popupImage"
                                    type="file"
                                    onChange={(e) => {
                                        // Use e.target.files to get the selected files
                                        const selectedFile = e.target.files[0];

                                        // Update the state with the selected file
                                        setFormValues((prevValues) => ({
                                            ...prevValues,
                                            popupImage: selectedFile,
                                        }));
                                    }}
                                    fullWidth
                                />
                            </MDBox>
                        </MDBox>
                        <MDBox className="inputsHeader" >
                            <MDInput
                                value={formValues.headerEnglish}
                                name="headerEnglish"
                                type="text"
                                onChange={(e) =>
                                    setFormValues((prevValues) => ({
                                        ...prevValues,
                                        headerEnglish: e.target.value,
                                    }))
                                }
                                label={formValues.headerEnglish ? '' : "Header English"}
                                fullWidth
                            />
                            <MDInput
                                value={formValues.headerTurkish}
                                name="headerTurkish"
                                type="text"
                                onChange={(e) =>
                                    setFormValues((prevValues) => ({
                                        ...prevValues,
                                        headerTurkish: e.target.value,
                                    }))
                                }
                                label={formValues.headerTurkish ? '' : "Header Turkish"}
                                fullWidth
                            />
                        </MDBox>
                        <MDBox className="inputsText">
                            {formValues.text.map((item, index) => (
                                <div key={index}>
                                    <MDInput
                                        value={item.englishTranslation}
                                        name={`englishTranslation-${index}`}
                                        type="text"
                                        onChange={(e) =>
                                            handleTextChange(index, "englishTranslation", e.target.value)
                                        }
                                        label={item.englishTranslation ? "" : "English Translation"}
                                        fullWidth
                                    />
                                    <MDInput
                                        value={item.turkishTranslation}
                                        name={`turkishTranslation-${index}`}
                                        type="text"
                                        onChange={(e) =>
                                            handleTextChange(index, "turkishTranslation", e.target.value)
                                        }
                                        label={item.turkishTranslation ? "" : "Turkish Translation"}
                                        fullWidth
                                    />
                                    <MDButton onClick={() => removeTextItem(index)}>Remove</MDButton>
                                </div>
                            ))}
                            <MDButton onClick={addTextItem}>Add Text Item</MDButton>
                        </MDBox>
                        <MDBox className="submit" >
                            <MDButton onClick={submitChanges} >Submit</MDButton>
                        </MDBox>
                    </MDBox> : <MDBox display="flex" alignItems="center" justifyContent="center" padding="2em"  >
                        <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
                            No Data Found
                        </MDTypography>
                    </MDBox>}
                </DashboardLayout>}
        </>
    )
}

export default PopupManager
