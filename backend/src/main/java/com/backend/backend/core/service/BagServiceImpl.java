package com.backend.backend.core.service;

import com.backend.backend.common.ApiResponse;
import com.backend.backend.core.dto.request.RequestBagDTO;
import com.backend.backend.core.dto.request.RequestScanOutBagDTO;
import com.backend.backend.core.dto.response.ResponseBagDTO;
import com.backend.backend.core.impl.BagService;
import com.backend.backend.data.models.Bag;
import com.backend.backend.data.models.User;
import com.backend.backend.data.repositories.BagRepository;
import com.backend.backend.securities.config.UserCredential;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BagServiceImpl implements BagService {
    private final BagRepository bagRepository;
    private final UserCredential userCredential;


    @Override
    public ApiResponse<?> scanIn(RequestBagDTO dto) {
        List<Bag> bagList = bagRepository.findByLotNumber(dto.lotNumber());
        ApiResponse<String> apiResponse = new ApiResponse<>();

        if(bagList.isEmpty()) {

            for(Long i = 1L; i <= dto.bagNumber() ; i++){
                Bag newBag = new Bag();
                newBag.setLotNumber(dto.lotNumber());
                newBag.setBagNumber(i);

                LocalDate datePart = dto.Date().toLocalDateTime().toLocalDate(); // Get only the date
                LocalTime timePart = LocalTime.now(); // Get current time
                LocalDateTime combinedDateTime = LocalDateTime.of(datePart, timePart);
                Timestamp timestamp = Timestamp.valueOf(combinedDateTime);

                newBag.setCreatedAt(timestamp);
                User user = userCredential.getCredentialUser();
                newBag.setCreatedBy(user.getEmail());
                newBag.setStatus("SCANNED_IN");
                bagList.add(newBag);
            }
            bagRepository.saveAll(bagList);
            apiResponse.setHttpStatusCode(HttpStatus.OK.value());
            apiResponse.setMessage("Successfully scanned in bags");
        }else{
            apiResponse.setMessage("Lot number is not unique");
            apiResponse.setHttpStatusCode(HttpStatus.BAD_REQUEST.value());
        }

        return apiResponse;
    }

    @Override
    @Transactional
    public ApiResponse<?> scanOut(RequestScanOutBagDTO dto) {
        Optional<Bag> bag = bagRepository.findByBagNumberAndLotNumber(dto.bagNumber(),dto.lotNumber());
        ApiResponse<String> apiResponse = new ApiResponse<>();


        if(bag.isPresent()) {
            if(bag.get().getStatus().equals("SCANNED_OUT")){
                apiResponse.setMessage("Bag already scanned out");
                apiResponse.setHttpStatusCode(HttpStatus.OK.value());
            }else{
                bag.get().setStatus("SCANNED_OUT");
                User user = userCredential.getCredentialUser();
                bag.get().setScannedOutBy(user.getEmail());
                bag.get().setScannedOutDate(new Timestamp(System.currentTimeMillis()));
                apiResponse.setMessage("Successfully scanned out bag");
                apiResponse.setHttpStatusCode(HttpStatus.OK.value());
            }
        }else{
            apiResponse.setData("Bag not found");
            apiResponse.setHttpStatusCode(HttpStatus.NOT_FOUND.value());
        }
        return apiResponse;
    }

    @Override
    public ApiResponse<?> getscanOut() {
        ApiResponse<List<ResponseBagDTO>> apiResponse = new ApiResponse<>();

        List<Bag> list = bagRepository.findByStatus("SCANNED_OUT");

        List<ResponseBagDTO> listDTO = new ArrayList<>();

        for(Bag b : list){
            listDTO.add(new ResponseBagDTO(
                    b.getCreatedAt(),
                    b.getCreatedBy(),
                    b.getLotNumber(),
                    b.getBagNumber(),
                    b.getScannedOutDate(),
                    b.getScannedOutBy()
            ));
        }
        apiResponse.setData(listDTO);
        apiResponse.setHttpStatusCode(HttpStatus.OK.value());
        return apiResponse;
    }

    @Override
    public ApiResponse<?> getscanIn() {
        ApiResponse<List<ResponseBagDTO>> apiResponse = new ApiResponse<>();

        List<Bag> list = bagRepository.findByStatus("SCANNED_IN");

        List<ResponseBagDTO> listDTO = new ArrayList<>();

        for(Bag b : list){
            listDTO.add(new ResponseBagDTO(
                    b.getCreatedAt(),
                    b.getCreatedBy(),
                    b.getLotNumber(),
                    b.getBagNumber(),
                    b.getScannedOutDate(),
                    b.getScannedOutBy()
            ));
        }
        apiResponse.setData(listDTO);
        apiResponse.setHttpStatusCode(HttpStatus.OK.value());
        return apiResponse;
    }
}
