import {ErrorMessage} from '@hookform/error-message';
import {ethers} from 'ethers';
import DealerNFT from './Full.json';
import {useForm, Controller} from 'react-hook-form';
import { useState } from 'react';
import Select from 'react-select';


const DealerNFTAddress = process.env.CONTRACTADDR || '0x29b0823CC7145016A6Ada0De4B2d9B0B7fb3897d';
const options = [
    { value: 'LMV', label: 'LMV - (Cars, SUVs, Jeeps)'},
    { value: 'MCWG', label: 'Motorcycles with/without gears'},
    { value: 'HGMV', label: 'Trailers, Trucks, Goods carrier'},
    { value: 'HPMV', label: 'Passenger carrier with Country Permit'},
];
const default_value = 'LMV';
const MainMint = ({accounts, setAccounts}) => {
    const [isLoading, setLoading] = useState(false);
    const {register, formState: { errors },handleSubmit, control} = useForm();
    const isConnected = Boolean(accounts[0]);
    const onSubmit = async (data) => {
        setLoading(true);
        console.log(data);
        await create(data);
    };


    async function connectAccount() {
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const data = accounts[0];
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                DealerNFTAddress,
                DealerNFT.abi,
                signer
            );
            try{
                const response = await contract.balanceOf(data.toString());
                if(response._hex === "0x00"){
                    console.log("Allowed");
                    setAccounts(accounts);
                }else{
                    console.log("Not Allowed");
                    alert(`Account already registered/Onboarded!! Please Disconnect Metamask and try another account.\n You can view your nft at: 'https://testnets.opensea.io/collection/dealership-reg7-v2' `)
                }
                // console.log('Balance Of ', response._hex);
            }catch (error){
                console.log("Error: ", error);
            }
            // try {
            //     // const response = await contract.searchByAddress(data.toString());
            //     // const res = {
            //     //     Brand: response.Brand,
            //     //     WalletAddress: response.walletAddress,
            //     // }
            //     // console.log("Response; ", res);
            //     // if(response._hex === "0x00"){
            //     //     console.log("Allowed");
            //     //     setAccounts(accounts);
            //     // }else{
            //     //     console.log("Not Allowed");
            //     //     alert(`Account already registered/Onboarded!! Please Disconnect Metamask and try another account.\n You can view your nft at: 'https://testnets.opensea.io/collection/dealership-reg7-v2' `)
            //     // }
            // } catch (error) {
            //     console.log("Error: ", error)
            // }
            
            // await checkAccount(accounts[0]);
        }
    }

    async function create(data) {
        if(window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                DealerNFTAddress,
                DealerNFT.abi,
                signer
            );
            try {
                const response = await contract.checkForDuplicate(data.Reg_id);
                console.log('response: ', response);
                if(!response) {
                    const res = await contract.create(data.RegisteredName, data.Brand, data.Reg_id, data.Vehicle_Cat, data.Address, {
                        value: ethers.utils.parseEther((1).toString()),
                    });
                    try {
                        console.log("Response: ", res);
                        alert("Minting succesful, wait for your wallet for transaction details.\n You can see your Dealership NFT at: 'https://testnets.opensea.io/collection/dealership-reg7-v2'");
                        setLoading(false);
                    } catch (error) {
                        console.log("error: ", error.error)
                        alert(error.error);
                        setLoading(false);
                    }
                } else {
                    console.log("Cannot mint... App ID already registered!")
                    alert("App ID already registered!");
                    setLoading(false);
                }
                
            } catch (err) {
                console.log("error: ", err.error.message)
                alert(err.error.message);
                setLoading(false);
            }
            
        }
    }

    
    return (
        
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            
            {isConnected ? (
                <div>
                    <div>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h1>Dealership Onboarding NFT</h1>

                            <div>
                                Connected Account:
                                <div>
                                    {accounts[0]}
                                </div>
                            </div>
                            <div>
                                <label>Registered Name:* </label>
                                <input name="RegisteredName" {...register("RegisteredName", {required: 'This field is required!'})} />
                                <ErrorMessage errors={errors} name="RegisteredName" as="p" />
                            </div>
                            <div>
                                <label>Brand:* </label>
                                <input name="Brand" {...register("Brand", {required: 'This field is required!'})} />
                                <ErrorMessage errors={errors} name="Brand" as="p"/>
                            </div>
                            <div>
                                <label>App ID:* </label>
                                <input name="Reg_id" {...register("Reg_id", { required:'This field is required!' ,pattern: { value: /^[A-Z0-9]+$/g, message: 'Only Letters and Numbers. Enter without dashes and spaces. Example: "AA11AAAA1111111"'}})} />
                                <ErrorMessage errors={errors}  name="Reg_id" as="p"/>
                            </div>
                            <div>
                                <label>Vehicle Category:* </label>
                                <Controller
                                    name = "Vehicle_Cat"
                                    control={control}
                                    defaultValue={default_value}
                                    render={({ value, ref, field, name, onChange }) => (
                                        <Select
                                            inputRef={ref}
                                            classNamePrefix="addl-class"
                                            options={options}
                                            value={options.find(c => c.value === value)}
                                            onChange={(e) => field.onChange(e.value)}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label>Address:* </label>
                                <input name="Address" {...register("Address", {required: 'This field is required!'})} />
                                <ErrorMessage errors={errors} name="Address" as="p" />
                            </div>
                            {
                                isLoading ? (
                                    <button className='loading' disabled type="button">Loading</button>
                                ) : (
                                    <input  className='submitButton' type="submit" />
                                )
                            }
                            
                        </form>
                        
                    </div>
                </div>
            ) : (
               <div className='Button'>
                <button className='connect' onClick={connectAccount}>Connect</button>
               </div> 
            )}
        </div>
        
    )
}

export default MainMint;