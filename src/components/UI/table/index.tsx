import {
  Alert,
  Box,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import React from "react";
interface ITableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[] | undefined; // data that shows in table
  tableColumns: { title: string; field: string; style?: object }[]; // title: name of column, field: property name
  tableLabel: string; // table label that uses for tests
  emptyTableMessage: string; // message that shows when table is empty
  actions?: {
    icon: JSX.Element;
    secondaryIcon?: JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler?: (value: any) => void;
  }[]; // last column
  tableStyle?: object;
  isLoading?: boolean;
  isError?: boolean;
  hasCollaps?: boolean;
}

export default function ITable(props: ITableProps) {
  const theme = useTheme();

  return (
    <>
      <TableContainer
        component={Box}
        sx={{
          borderRadius: "20px",
          mt: 2,
          p: 3,
          boxSizing: "border-box",
          backgroundColor: theme.palette.secondary.light,
        }}
      >
        <Table
          sx={{
            minWidth: 680,
            tableLayout: "fixed",
            borderCollapse: "separate",
            borderSpacing: "0px 15px",
          }}
          aria-label={props.tableLabel}
        >
          <TableHead sx={{ mb: 2 }}>
            <TableRow
              sx={{
                backgroundColor: theme.palette.common.white,
                border: 0,
                boxShadow:
                  "4px 4px 8px 0px rgba(241, 243, 245, 0.8), -4px -1px 8px 0px rgba(241, 243, 245, 0.8)",
                "& td:last-of-type, & th:last-of-type": {
                  borderRadius: "0px 10px 10px 0px",
                },
                "& th": {
                  border: "none !important",
                },
                "& td:first-of-type, & th:first-of-type": {
                  borderRadius: "10px 0px 0px 10px",
                },
                "& td, & th": {
                  p: 1,
                },
              }}
            >
              {props.tableColumns.map((header) => (
                <TableCell
                  align="center"
                  key={header.field}
                  component="th"
                  sx={{
                    ...header.style,
                  }}
                >
                  {header.title}
                </TableCell>
              ))}
              {props.actions && <TableCell align="center">عملیات</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {props?.isLoading &&
              [...Array(3)].map((_e, i) => (
                <TableRow
                  // index is not good for key, my option is uuid
                  key={i}
                  sx={{
                    backgroundColor: theme.palette.common.white,
                    border: 0,
                    boxShadow:
                      "4px 4px 8px 0px rgba(241, 243, 245, 0.8), -4px -1px 8px 0px rgba(241, 243, 245, 0.8)",
                    "& td, & th": {
                      border: 0,
                    },
                    "& td:first-of-type, & th:first-of-type": {
                      borderRadius: "10px 0px 0px 10px",
                    },
                    "& td:last-child, & th:last-child": {
                      borderRadius: "0px 10px 10px 0px",
                    },
                    "&:hover td": {
                      backgroundColor: theme?.palette?.primary?.light,
                    },
                  }}
                >
                  {props.tableColumns.map((_e, i) => (
                    <TableCell key={i}>
                      <Skeleton
                        variant="rounded"
                        height={30}
                        animation="wave"
                      />
                    </TableCell>
                  ))}
                  {props.actions && (
                    <TableCell>
                      <Skeleton
                        variant="rounded"
                        height={30}
                        animation="wave"
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}

            {props.isError && (
              <TableRow
                sx={{
                  border: 0,
                  "& td, & th": {
                    border: 0,
                    padding: 0,
                  },
                }}
              >
                <TableCell
                  sx={{ p: 2 }}
                  align="center"
                  colSpan={
                    props.actions
                      ? props.tableColumns.length + 1
                      : props.tableColumns.length
                  }
                >
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{ justifyContent: "center" }}
                  >
                    دریافت اطلاعات با خطا مواجه شده است. لطفا دوباره تلاش کنید.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
            {!props.isError && props?.tableData?.length === 0 && (
              <TableRow
                sx={{
                  backgroundColor: theme.palette.common.white,
                  border: 0,
                  boxShadow:
                    "4px 4px 8px 0px rgba(241, 243, 245, 0.8), -4px -1px 8px 0px rgba(241, 243, 245, 0.8)",
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                  "& td, & th": {
                    border: 0,
                    borderRadius: "10px",
                  },
                }}
              >
                <TableCell
                  sx={{ p: 2 }}
                  align="center"
                  colSpan={
                    props.actions
                      ? props.tableColumns.length + 1
                      : props.tableColumns.length
                  }
                >
                  {props.emptyTableMessage}
                </TableCell>
              </TableRow>
            )}
            {!props.isError &&
              props.tableData?.map((row) => (
                // index is not good for key, my option is uuid
                <React.Fragment key={row.id}>
                  <TableRow
                    sx={{
                      backgroundColor: theme.palette.common.white,
                      border: 0,
                      boxShadow:
                        "4px 4px 8px 0px rgba(241, 243, 245, 0.8), -4px -1px 8px 0px rgba(241, 243, 245, 0.8)",
                      "& td, & th": {
                        border: 0,
                      },
                      "& td:first-of-type, & th:first-of-type": {
                        borderRadius: "10px 0px 0px 10px",
                      },
                      "& td:last-child, & th:last-child": {
                        borderRadius: "0px 10px 10px 0px",
                      },
                      "&:hover td": {
                        backgroundColor: theme?.palette?.primary?.light,
                        color: "white",
                      },
                      "&:hover button": {
                        color: "white",
                      },
                    }}
                  >
                    {props.tableColumns.map((header, index) => (
                      <TableCell
                        align="center"
                        // index is not good for key, my option is uuid
                        key={index}
                        sx={{
                          transition: "all 0.2s",
                          p: 2,
                          ...props.tableStyle,
                          ...header.style,
                        }}
                        // title={row[header.field]}
                      >
                        {row[header.field]}
                      </TableCell>
                    ))}
                    {props.actions?.length && (
                      <TableCell
                        sx={{ transition: "all 0.2s" }}
                        align={"center"}
                      >
                        {props.actions?.map((action, index) => (
                          <IconButton
                            sx={{ transition: "all 0.2s" }}
                            onClick={action.handler?.bind(null, row.id)}
                            key={index}
                          >
                            {row.isBotBlocked === undefined && action.icon}
                            {row.isBotBlocked === true && action.secondaryIcon}
                            {row.isBotBlocked === false && action.icon}
                          </IconButton>
                        ))}
                      </TableCell>
                    )}
                  </TableRow>
                  {props.hasCollaps && (
                    <TableRow>
                      <TableCell
                        style={{
                          paddingBottom: 0,
                          paddingTop: 0,
                        }}
                        colSpan={
                          props.actions
                            ? props.tableColumns.length + 1
                            : props.tableColumns.length
                        }
                      >
                        {row.description}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
