import { Box, Button, Grid, Switch, Typography } from "@mui/material";
import theme from "../../utils/theme";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userCrud } from "../../slices/userSlice";
import { useEffect, useState } from "react";
import Loading from "../utils/Loading";

const PermissionControlForUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userPermission, setUserPermission] = useState([]);
  const [permissionToUpdate, setPermissionToUpdate] = useState([]); // Initialize as an empty array
  const { user: user, loading } = useSelector((state) => state.User);

  const fetchUser = async () => {
    const userDispatch = await dispatch(userCrud({ method: "get", data: null, id: id }));

    const updatedUserPermissions = userDispatch.payload?.permissions.map((perm) => ({
      ...perm,
      checked: userDispatch.payload.user.permission.some((userPerm) => userPerm.id === perm.id),
    }));
    setUserPermission(updatedUserPermissions);
  };

  const handleUpdatePermission = (e, permissionId) => {
    setUserPermission((prevState) =>
      prevState.map((permission) => ({
        ...permission,
        checked: permission.id === permissionId ? !permission.checked : permission.checked,
      }))
    );
  };

  const handleUpdate = async () => {
    const formattedData = permissionToUpdate.map((per) => ({
      id: per.id,
      name: per.name,
    }));
    const data = {
      id: Number(id),
      permissions: formattedData,
    };
    await dispatch(userCrud({ method: "put", data: data, id: id }));
    fetchUser();
  };

  useEffect(() => {
    const filteredPermissions = userPermission.filter((per) => per.checked === true);
    setPermissionToUpdate(filteredPermissions);
  }, [userPermission]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <Box
      sx={{
        bgcolor: theme.palette.common.white,
        borderRadius: "10px",
        p: 3,
        height: "100vh",
      }}
    >
      {loading && <Loading />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 5,
        }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
          Permission Controls for {user?.user?.name}({user?.user?.position})
        </Typography>
        <Button onClick={() => handleUpdate()} variant="contained">
          Save Changes
        </Button>
      </Box>
      <Grid container spacing={4}>
        {user && user.permissions ? (
          user.permissions.map((permission, index) => (
            <Grid item xs={6} key={index}>
              <Box>
                <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>{permission.name}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    Do you want to allow this user {permission.name.toLowerCase()}.
                  </Typography>
                  <Switch
                    checked={userPermission[index]?.checked || false}
                    onChange={(e) => handleUpdatePermission(e, permission.id)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              </Box>
            </Grid>
          ))
        ) : (
          <Navigate to={"/user-management"} />
        )}
      </Grid>
    </Box>
  );
};

export default PermissionControlForUser;
