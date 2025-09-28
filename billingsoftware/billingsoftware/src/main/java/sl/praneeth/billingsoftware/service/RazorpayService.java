package sl.praneeth.billingsoftware.service;

import com.razorpay.RazorpayException;
import sl.praneeth.billingsoftware.io.RazorpayOrderResponse;

public interface RazorpayService {

    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
