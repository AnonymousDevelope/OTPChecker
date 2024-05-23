import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Spinner,
  useToast,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function MyForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpText, setOTPText] = useState("");
  const [otpVerified, setOTPVerified] = useState(false); // New state for OTP verification
  const toast = useToast();

  const baseUrl = "https://otpcheckerbackend.onrender.com";

  const sendEmail = async () => {
    setLoading(true);
    setSuccess(false);
    let dataSend = {
      email: email,
    };
    try {
      const response = await axios.post(`${baseUrl}/email/sendEmail`, dataSend, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log(response);
      if (response.status === 200) {
        setSuccess(true);
        setOTP(response.data.otp);
        toast({
          title: "Success",
          description: "Email sent successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to send email: ${response.status}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  // Function to verify OTP
  const verifyOTP = () => {
    if (otpText === otp) {
      setOTPVerified(true);
      toast({
        title: "Success",
        description: "OTP verified successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Send OTP to the Account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Don't forget to subscribe ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            {success ? (
              <Flex gap={5} direction={"column"} align={"start"}>
              <FormControl id="otp">
                <FormLabel>Email sent successfully! Enter OTP:</FormLabel>
                <Input
                  type="text"
                  value={otpText}
                  placeholder="OTP Code ...."
                  onChange={(e) => setOTPText(e.target.value)}
                />
              </FormControl>
                <Button
                  isLoading={loading}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={verifyOTP}
                >
                  Verify OTP
                </Button>
              </Flex>
            ) : (
              <Flex gap={4} direction={"column"} align={"start"}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Receiver's Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <Button
                  isLoading={loading}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={() => sendEmail()}
                  disabled={success} // Disable button if email is successfully sent
                >
                  Send Email
                </Button>
              </Flex>
            )}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
